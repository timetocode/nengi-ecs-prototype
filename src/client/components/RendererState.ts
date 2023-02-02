import { Container } from 'pixi.js'

// renderer-related state, not pure ecs but an attempt at wrapping pixi state
// in a way where the rest of the application stays mostly ecs
class RendererState {
    stage: Container
    camera: Container

    constructor() {
        this.stage = new Container()
        this.camera = new Container()
        this.stage.addChild(this.camera)
    }
}

export { RendererState }