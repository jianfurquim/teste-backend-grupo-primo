import { FastifyInstance } from 'fastify'
import { list } from './list'
import { create } from './create'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { deleteAccount } from './delete'
import { getAccountByNumber } from './get-account-by-number'

export async function accountsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/accounts', list)
  app.get('/accounts/by-number', getAccountByNumber)
  app.post('/accounts/create', create)
  app.delete('/accounts/delete', deleteAccount)
}
