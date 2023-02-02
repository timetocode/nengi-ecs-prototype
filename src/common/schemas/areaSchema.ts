import { Binary, defineSchema, SchemaDefinition, Schema } from 'nengi'

const areaSchema: Schema = defineSchema({
    hexColor: Binary.Float64,
    pid: Binary.UInt32,
    width: Binary.UInt16,
    height: Binary.UInt16
})

export { areaSchema }
