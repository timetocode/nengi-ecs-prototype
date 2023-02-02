import { AiKnowledge } from '../components/AiKnowledge'
import { AiMode, AiState } from '../components/AiState'
import { NECS } from '../NECS'

class AiSystem {

    necs: NECS
    constructor(necs: NECS) {
        this.necs = necs
    }

    update(delta: number) {

        const aiKnowledge = this.necs.getSingleton(AiKnowledge) as AiKnowledge
        const ents = this.necs.getEntitiesWithComponents([AiState])

        ents.forEach(entity => {
            const aiState = this.necs.getComponent(entity, AiState) as AiState

            // find nearest player and target it
            let nearestPlayer = null
            let nearestDistance = Number.MAX_SAFE_INTEGER

            aiKnowledge.players.forEach(player => {
                const dx = player.x - entity.x
                const dy = player.y - entity.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                if (distance < nearestDistance && distance < 350) {
                    nearestDistance = distance
                    nearestPlayer = player
                }
            })

            if (nearestPlayer) {
                aiState.target = nearestPlayer
                aiState.mode = AiMode.Aggro
            } else {
                aiState.mode = AiMode.Idle
            }

            let { target, mode, walkTarget } = aiState
            // move towards target if we have one
            if (mode === AiMode.Aggro && target) {
                const dx = target.x - entity.x
                const dy = target.y - entity.y
                entity.x += dx * 0.1 * delta
                entity.y += dy * 0.1 * delta
            }

            if (mode === AiMode.Idle) {
                aiState.randomWalkAcc += delta
                if (aiState.randomWalkAcc > 3) {
                    aiState.randomWalkAcc = 0
                    walkTarget.x = entity.x + Math.random() * 100
                    walkTarget.y = entity.y + Math.random() * 100
                }
                const dx = walkTarget.x - entity.x
                const dy = walkTarget.y - entity.y
                entity.x += dx * 0.1 * delta
                entity.y += dy * 0.1 * delta
            }
        })
    }
}

export { AiSystem }