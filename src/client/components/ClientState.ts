class ClientState {
    isConnected: boolean
    myNid: Number // the nid of the entity we control
    myEntity: any // a reference our entity
    entities: Map<number, any>

    constructor() {
        this.isConnected = false
        this.myNid = -1
        this.myEntity = null
        this.entities = new Map()
    }
}

export { ClientState }