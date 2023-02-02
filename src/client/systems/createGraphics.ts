import { Shape } from '../../common/Shape'
import { NType } from '../../common/NType'
import { Container, Graphics, Text } from 'pixi.js'

// most games would have sprites or models, but this demo
// has some hardcoded geometry-based pixi graphics

// base entity object
function createEntityGraphics(entity: any) {
    const gfx = new Container()
    gfx.x = entity.x
    gfx.y = entity.y

    const text = new Text(entity.nid, {
        fontFamily: 'Arial',
        fontSize: 16,
        fill: 0xffffff,
        align: 'center',
    })
    text.x = -25
    text.y = -25
    text.alpha = 0.5
    gfx.addChild(text)
    return gfx
}

// various types of graphical components
function createComponentGraphics(entity: any) {
    if (entity.ntype === NType.Area) {
        const gfx = new Graphics()
        gfx.beginFill(entity.hexColor)
        gfx.drawRect(0, 0, entity.width, entity.height)
        gfx.alpha = 0.1
        return gfx
    }

    if (entity.ntype === NType.ShipType) {
        if (entity.shape === Shape.Circle) {
            const gfx = new Graphics()
            gfx.beginFill(entity.hexColor)
            gfx.drawCircle(0, 0, 10)
            return gfx
        }
        if (entity.shape === Shape.Square) {
            const gfx = new Graphics()
            gfx.beginFill(entity.hexColor)
            gfx.drawRect(-10, -10, 20, 20)
            return gfx
        }
    }

    throw new Error("tried to create graphics for unrecognized entity type")
}

export { createEntityGraphics, createComponentGraphics }