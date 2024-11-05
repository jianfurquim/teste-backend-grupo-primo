import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { create } from './create'
import { tranferDelete } from './delete'
import { schemaCreateTransfer } from '../../../utils/swagger-schemas/transfers/schema-create'
import { schemaDeleteTransfer } from '../../../utils/swagger-schemas/transfers/schema-delete'

export async function transfersRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/transfers/create', { schema: schemaCreateTransfer }, create)
  app.delete(
    '/transfers/delete',
    { schema: schemaDeleteTransfer },
    tranferDelete,
  )
}
