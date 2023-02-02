import { Instance, NetworkEvent, ViewAABB, } from 'nengi'
import { ncontext } from '../common/ncontext'
import { NType } from '../common/NType'
import { uWebSocketsInstanceAdapter } from 'nengi-uws-instance-adapter'
import { BufferWriter } from 'nengi-buffers'
import { Shape } from '../common/Shape'
import { NECS } from './NECS'
import { AiSystem } from './systems/AiSys'
import { AiState } from './components/AiState'
import { AiKnowledge } from './components/AiKnowledge'

// mocks hitting an external service to authenticate a user
const authenticateUser = async (handshake: any) => {
    return new Promise<any>((resolve, reject) => {
        setTimeout(() => { // as if the api took time to respond
            if (handshake.token === 12345) {
                resolve({ character: 'neuron', level: 24, hp: 89 })
            } else {
                reject('Connection denied: invalid token.')
            }
        }, 500)
    })
}

const instance = new Instance(ncontext, BufferWriter)
// uws! node.js

const port = 9001
const uws = new uWebSocketsInstanceAdapter(instance.network, { /* uws config */ })
uws.listen(port, () => { console.log(`uws adapter is listening on ${port}`) })
instance.network.registerNetworkAdapter(uws)
instance.onConnect = authenticateUser

const ecs = new NECS(instance)

const main = instance.createChannel()
const space = instance.createSpatialChannel()


const aiKnowledge = new AiKnowledge()
ecs.registerSingleton(AiKnowledge, aiKnowledge)

const aiSys = new AiSystem(ecs)

{
    for (let i = 0; i < 10; i++) {
        const ent = {
            nid: 0,
            ntype: NType.Entity,
            x: Math.random() * 550,
            y: Math.random() * 550,
            hp: 100
        }

        main.addEntity(ent)

        ecs.registerEntity(ent)

        const c = {
            nid: 0,
            ntype: NType.ShipType,
            shape: Shape.Square,
            pid: ent.nid,
            hexColor: 0xff0000
        }

        ecs.addNetworkComponent(ent, c)

        const aiState = new AiState()
        ecs.addComponent(ent, aiState)
    }
}


{
    const ent = {
        nid: 0,
        ntype: NType.Entity,
        x: 600,
        y: 600,
    }

    main.addEntity(ent)

    ecs.registerEntity(ent)

    const c = {
        nid: 0,
        ntype: NType.Area,
        pid: ent.nid,
        hexColor: 0xffff00,
        width: 400,
        height: 300
    }

    ecs.addNetworkComponent(ent, c)


}


const queue = instance.network.queue

const update = () => {
    // input
    while (!queue.isEmpty()) {
        const networkEvent = queue.next()

        if (networkEvent.type === NetworkEvent.UserDisconnected) {
            const user = networkEvent.user
            // @ts-ignore
            const entity = user.entity
            space.removeEntity(entity)
        }

        if (networkEvent.type === NetworkEvent.UserConnected) {
            const user = networkEvent.user

            main.subscribe(user)
            const testArray = new Uint8Array([1, 2, 3])
            //main.addMessage({ ntype: NType.TestMessage, a: 123, b: Math.PI, text: 'ℎḗιḽỗ шṑɽḻδ test test 123',  bytes: testArray })
            //for (let i = 0; i < 3; i++) {
            //    main.addMessage({ ntype: 1, a: i, b: Math.PI + i })
            //}
            // @ts-ignore
            user.view = new ViewAABB(0, 0, 2200, 2200)
            // @ts-ignore
            space.subscribe(networkEvent.user, user.view)

            const playerEntity = {
                nid: 0,
                ntype: NType.Entity,
                x: Math.random() * 500,
                y: Math.random() * 500,
            }
            // @ts-ignore
            networkEvent.user.entity = playerEntity

            space.addEntity(playerEntity)

            const colorComponent = {
                nid: 0,
                ntype: NType.ShipType,
                pid: playerEntity.nid,
                hexColor: 0x00ff00
            }
            // TODO this is something a system should do
            aiKnowledge.players.add(playerEntity)

            instance.attachEntity(playerEntity, colorComponent)
            user.queueMessage({ myId: playerEntity.nid, ntype: NType.IdentityMessage })
        }

        if (networkEvent.type === NetworkEvent.Command) {
            const user = networkEvent.user
            // @ts-ignore
            const entity = user.entity

            //console.log(networkEvent.payload)
            if (networkEvent.command.ntype === NType.Command) {
                const { w, a, s, d, delta } = networkEvent.command

                const movementVector = { x: 0, y: 0 }
                if (w) { movementVector.y -= 100 * delta }
                if (s) { movementVector.y += 100 * delta }
                if (a) { movementVector.x -= 100 * delta }
                if (d) { movementVector.x += 100 * delta }
                // TODO: normalize the vector
                entity.x += movementVector.x
                entity.y += movementVector.y
                // TODO: collision that prevents movement
            }
            // @ts-ignore
            user.view.x = entity.x
            // @ts-ignore
            user.view.y = entity.y
        }
    }


    aiSys.update(1/20)

    instance.step()
}

setInterval(() => {
    const start = performance.now()
    update()
    const end = performance.now()
    // console.log('connected clients', instance.users.size, ' :: ', end - start, 'time')
}, 50)




