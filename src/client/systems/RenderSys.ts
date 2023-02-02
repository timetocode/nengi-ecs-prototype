import { Renderer } from 'pixi.js'
import { ECS } from '../../common/ECS'
import { ClientState } from '../components/ClientState'
import { RendererState } from '../components/RendererState'

class RenderSys {
    renderer: Renderer
    ecs: ECS

    constructor(ecs: ECS) {
        this.ecs = ecs
        const canvas: HTMLCanvasElement = document.getElementById('main-canvas') as HTMLCanvasElement
        this.renderer = new Renderer({
            view: canvas,
            width: window.innerWidth,
            height: window.innerHeight,
        })

        window.addEventListener('resize', () => {
            this.renderer.resize(window.innerWidth, window.innerHeight)
        })
    }

    update() {
        const rendererState = this.ecs.getSingleton(RendererState) as RendererState
        const clientState = this.ecs.getSingleton(ClientState) as ClientState

        if (clientState.myEntity) {
            // center camera on controlled player
            rendererState.camera.x = -clientState.myEntity.x + window.innerWidth * 0.5
            rendererState.camera.y = -clientState.myEntity.y + window.innerHeight * 0.5
        }

        this.renderer.render(rendererState.stage)
    }
}

export { RenderSys }