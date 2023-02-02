class ECS {
    lookup: Map<any, Set<any>> // <Entity, Set<Components>>
    singletons: Map<any, any> // <ClassType, Component>
    systems: Set<any> // <System>

    constructor() {
        this.lookup = new Map()
        this.singletons = new Map()
        this.systems = new Set()
    }

    update(delta: number) {
        this.systems.forEach(system => {
            system.update(delta)
        })
    }


    doesEntityMatchComponents(entity: any, componentClasses: any[]) {
        const components = this.lookup.get(entity)
        if (!components) {
            return false
        }

        const targetMatches = componentClasses.length
        let matches = 0
        for (let i = 0; i < componentClasses.length; i++) {
            const componentClass = componentClasses[i]

            components.forEach(component => {
                if (component instanceof componentClass) {
                    matches++
                }
            })
        }

        return matches === targetMatches
    }

    getComponent(entity: any, componentType: any): any {
        // TODO optimize
        const components = this.lookup.get(entity)
        let component = null
        components.forEach(c => {
            if (c instanceof componentType) {
                 component = c
            }
        })
        return component
    }


    getEntitiesWithComponents(componentTypes: any[]) {
        // brute force atm
        const entities: any[] = []
        this.lookup.forEach((components, entity) => {
            if (this.doesEntityMatchComponents(entity, componentTypes)) {
                entities.push(entity)
            }
        })
        return entities
    }

    registerSystem(system: any) {
        this.systems.add(system)
    }

    getSingleton(key: any) {
        return this.singletons.get(key)
    }

    registerSingleton(key: any, singleton: any) {
        this.singletons.set(key, singleton)
    }

    unregisterSingleton(key: any) {
        this.singletons.delete(key)
    }

    registerEntity(entity: any) {
        this.lookup.set(entity, new Set())
    }

    unregisterEntity(entity: any) {
        this.lookup.delete(entity)
    }

    addComponent(entity: any, component: any) {
        const components = this.lookup.get(entity)
        components.add(component)
    }

    removeComponent(entity: any, component: any) {
        const components = this.lookup.get(entity)
        components.delete(component)
    }
}

export { ECS }