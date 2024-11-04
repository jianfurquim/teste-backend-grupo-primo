import { FastifyInstance } from 'fastify'
import { list } from './list'
import { create } from './create'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { deleteAccount } from './delete'

export async function accountsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/accounts', list)
  app.post('/accounts/create', create)
  app.delete('/accounts/delete', deleteAccount)
}
