
// a singleton of state that the ai is aware of
// basically just the existence of the players
class AiKnowledge {

    players: Set<any>
    constructor() {
        this.players = new Set()
    }
}

export { AiKnowledge }