import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { create } from './create'
import { tranferDelete } from './delete'

export async function transfersRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/transfers/create', create)
  app.delete('/transfers/delete', tranferDelete)
}
