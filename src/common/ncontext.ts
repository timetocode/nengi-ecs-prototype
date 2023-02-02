import { Context } from 'nengi'
import { testMessageSchema } from './schemas/testMessageSchema'
import { entitySchema } from './schemas/entitySchema'
import { testCommandSchema } from './schemas/testCommandSchema'
import { NType } from './NType'
import { identityMessageSchema } from './schemas/identityMessageSchema'
import { shipTypeSchema} from './schemas/shipTypeSchema'
import { areaSchema } from './schemas/areaSchema'

const ncontext = new Context()
ncontext.register(NType.TestMessage, testMessageSchema)
ncontext.register(NType.Entity, entitySchema)
ncontext.register(NType.Command, testCommandSchema)
ncontext.register(NType.IdentityMessage, identityMessageSchema)
ncontext.register(NType.ShipType, shipTypeSchema)
ncontext.register(NType.Area, areaSchema)

export { ncontext }