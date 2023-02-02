
import { Binary, defineSchema, Schema } from 'nengi'

const testMessageSchema: Schema = defineSchema({
    a: Binary.UInt8,
    b: Binary.Float64,
    text: Binary.String,
    bytes: Binary.UInt8Array
})

export { testMessageSchema }
