import { Instance } from 'nengi'
import { ECS } from '../common/ECS'

// same as ECS but with a little extra wrapper
// for registering components with nengi
class NECS extends ECS {
    instance: Instance

    constructor(instance: Instance) {
        super()
        this.instance = instance
    }

    addNetworkComponent(entity: any, component: any) {
        super.addComponent(entity, component)
        this.instance.attachEntity(entity, component)
    }

    removeNetworkComponent(entity: any, component: any) {
        super.removeComponent(entity, component)
        this.instance.detachEntity(entity, component)
    }
}

export { NECS }