import { FastifyInstance } from 'fastify'
import { list_account } from './list-accounts'
import { create_account } from './create-account'
import { verifyJWT } from '../../middlewares/verify-jwt'

export async function accountsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/accounts', list_account)
  app.post('/accounts/create', create_account)
}
