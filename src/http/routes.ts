import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { create_account } from './controllers/create-account'
import { list_account } from './controllers/list-accounts'
import { verifyJWT } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/register', register)
  app.post('/authenticate', authenticate)

  /* Authenticated Routes */
  app.get('/accounts', { onRequest: [verifyJWT] }, list_account)
  app.post('/accounts/create', { onRequest: [verifyJWT] }, create_account)
}
