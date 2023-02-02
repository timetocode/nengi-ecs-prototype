import { Binary, defineSchema, Schema } from 'nengi'

const entitySchema: Schema = defineSchema({
    x: Binary.Float64,
    y: Binary.Float64,
})

export { entitySchema }
