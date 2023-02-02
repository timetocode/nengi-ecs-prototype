enum AiMode {
    Idle,
    Aggro
}


class AiState {
    mode: AiMode
    target: null | { x: number, y: number }
    randomWalkAcc: number
    walkTarget: { x: number, y: number }

    constructor() {
        this.mode = AiMode.Idle
        this.target = null
        this.randomWalkAcc = 0
        this.walkTarget = { x: 0, y: 0 }
    }
}

export { AiMode, AiState }