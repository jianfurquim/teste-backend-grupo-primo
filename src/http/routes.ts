import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { create_account } from './controllers/create-account'
import { list_account } from './controllers/list-accounts'

export async function appRoutes(app: FastifyInstance) {
  app.post('/register', register)
  app.post('/authenticate', authenticate)
  app.get('/accounts', list_account)
  app.post('/accounts/create', create_account)
}
