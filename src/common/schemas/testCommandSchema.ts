import { Binary, defineSchema, Schema } from 'nengi'

const testCommandSchema = defineSchema({
    w: Binary.Boolean,
    a: Binary.Boolean,
    s: Binary.Boolean,
    d: Binary.Boolean,
    delta: Binary.Float64
})

export { testCommandSchema }

