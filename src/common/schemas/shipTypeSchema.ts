import { Binary, defineSchema, SchemaDefinition, Schema } from 'nengi'

const shipTypeSchema: Schema = defineSchema({
    hexColor: Binary.Float64,
    pid: Binary.UInt32,
    shape: Binary.Int8
})

export { shipTypeSchema }
