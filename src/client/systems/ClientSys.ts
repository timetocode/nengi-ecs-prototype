import { Client, Interpolator } from 'nengi'
import { ncontext } from '../../common/ncontext'
import { NType } from '../../common/NType'
import { WebSocketClientAdapter } from 'nengi-websocket-client-adapter'
import { ECS } from '../../common/ECS'
import { RendererState } from '../components/RendererState'
import { ClientState } from '../components/ClientState'
import { InputState } from '../components/InputState'
import { createComponentGraphics, createEntityGraphics } from './createGraphics'

// an ecs-style wrapper around the nengi client
class ClientSys {
    client : Client
    interpolator: Interpolator
    ecs: ECS

    constructor(ecs: ECS) {
        this.client = new Client(ncontext, WebSocketClientAdapter)
        this.interpolator = new Interpolator(this.client)
        this.ecs = ecs

        // can't technically await this b/c ctor is not async
        this.connect()
    }

    async connect() {
        try {
            const res = await this.client.connect('ws://localhost:9001', { token: 12345 })
            console.log('connection response', res)
            const clientState = this.ecs.getSingleton(ClientState) as ClientState
            clientState.isConnected = true
        } catch (err) {
            console.log('connection error', err)
            return
        }
    }

    update(delta: number) {
        const clientState = this.ecs.getSingleton(ClientState) as ClientState
        const rendererState = this.ecs.getSingleton(RendererState) as RendererState
        const inputState = this.ecs.getSingleton(InputState) as InputState

        if (clientState.isConnected) {
            const istate = this.interpolator.getInterpolatedState()

            while (this.client.network.messages.length > 0) {
                const message = this.client.network.messages.pop()
                console.log({ message })
                if (message.ntype === NType.IdentityMessage) {
                    clientState.myNid = message.myId
                }
            }

            istate.forEach(snapshot => {
                // nengi entity create
                snapshot.createEntities.forEach((entity: any) => {
                    if (entity.ntype === NType.Entity) {
                        // it is the base entity
                        const gfx = createEntityGraphics(entity)
                        rendererState.camera.addChild(gfx)
                        clientState.entities.set(entity.nid, gfx)
                        if (entity.nid === clientState.myNid) {
                            clientState.myEntity = gfx
                        }
                    } else {
                        // some type of component
                        const parentEntity = clientState.entities.get(entity.pid)
                        const gfx = createComponentGraphics(entity)
                        parentEntity.addChild(gfx)
                    }
                })

                // nengi entity update
                snapshot.updateEntities.forEach((diff: any) => {
                    const entity = clientState.entities.get(diff.nid)!
                    if (!entity) {
                        console.log('got an update for an entity that didnt exist', diff)
                    }
                    entity[diff.prop] = diff.value
                })

                // nengi entity delete
                snapshot.deleteEntities.forEach((nid: number) => {
                    const entity = clientState.entities.get(nid)!
                    rendererState.camera.removeChild(entity)
                    clientState.entities.delete(nid)
                })
            })

            // send commands to server
            const { w, a, s, d } = inputState
            this.client.addCommand({
                ntype: NType.Command, w, a, s, d, delta
            })
            this.client.flush()
        }
    }
}

export { ClientSys }