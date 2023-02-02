import { ECS } from '../../common/ECS'
import { InputState } from '../components/InputState'

class InputSys {
    ecs: ECS
    constructor(ecs: ECS) {
        this.ecs = ecs

        const inputState = ecs.getSingleton(InputState) as InputState

        document.addEventListener('keydown', (e: KeyboardEvent) => {
            // @ts-ignore
            inputState[e.key] = true
        })

        document.addEventListener('keyup', (e: KeyboardEvent) => {
            // @ts-ignore
            inputState[e.key] = false
        })
    }

    update() {

    }
}

export { InputSys }