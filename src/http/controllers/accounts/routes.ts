import { FastifyInstance } from 'fastify'
import { list } from './list'
import { create } from './create'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { deleteAccount } from './delete'
import { getAccountByNumber } from './get-account-by-number'
import { schemaListAccounts } from '../../../utils/swagger-schemas/accounts/schema-list'
import { schemaGetAccountByNumber } from '../../../utils/swagger-schemas/accounts/schema-get-account-by-number'
import { schemaCreateAccount } from '../../../utils/swagger-schemas/accounts/schema-create'
import { schemaDeleteAccount } from '../../../utils/swagger-schemas/accounts/schema-delete'

export async function accountsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/accounts', { schema: schemaListAccounts }, list)
  app.get(
    '/accounts/by-number',
    { schema: schemaGetAccountByNumber },
    getAccountByNumber,
  )
  app.post('/accounts/create', { schema: schemaCreateAccount }, create)
  app.delete('/accounts/delete', { schema: schemaDeleteAccount }, deleteAccount)
}
