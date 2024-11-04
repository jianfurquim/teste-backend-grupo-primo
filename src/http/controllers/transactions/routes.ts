import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { listByUserId } from './list-by-user-id'
import { listTransactionsByAccount } from './list-by-account-number'
import { expenseCreate } from './expense-create'
import { incomeCreate } from './income-create'
import { expenseDelete } from './expense-delete'
import { incomeDelete } from './income-delete'

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/transactions', listByUserId)
  app.get('/transactions/by-account', listTransactionsByAccount)

  app.post('/expense/create', expenseCreate)
  app.delete('/expense/delete', expenseDelete)

  app.post('/income/create', incomeCreate)
  app.delete('/income/delete', incomeDelete)
}
