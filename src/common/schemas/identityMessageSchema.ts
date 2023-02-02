
import { Binary, defineSchema, Schema } from 'nengi'

const identityMessageSchema: Schema = defineSchema({
    myId: Binary.UInt32
})

export { identityMessageSchema }
