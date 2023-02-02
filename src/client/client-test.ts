import { ClientSys } from './systems/ClientSys'
import { ECS } from '../common/ECS'
import { ClientState } from './components/ClientState'
import { RendererState } from './components/RendererState'
import { InputState } from './components/InputState'
import { InputSys } from './systems/InputSys'
import { RenderSys } from './systems/RenderSys'

window.addEventListener('load', async () => {
    console.log('window loaded!')

    const ecs = new ECS()

    // singleton components
    ecs.registerSingleton(ClientState, new ClientState())
    ecs.registerSingleton(RendererState, new RendererState())
    ecs.registerSingleton(InputState, new InputState())

    // systems
    ecs.registerSystem(new ClientSys(ecs))
    ecs.registerSystem(new InputSys(ecs))
    ecs.registerSystem(new RenderSys(ecs))

    // render+logic loop
    let prev = performance.now()
    const loop = () => {
        window.requestAnimationFrame(loop)
        const now = performance.now()
        const delta = (now - prev) / 1000
        prev = now
        ecs.update(delta)
    }

    // start the loop
    loop()
})
