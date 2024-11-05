import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { listByUserId } from './list-by-user-id'
import { listTransactionsByAccountNumber } from './list-by-account-number'
import { expenseCreate } from './expense-create'
import { incomeCreate } from './income-create'
import { expenseDelete } from './expense-delete'
import { incomeDelete } from './income-delete'
import { schemaListByUserId } from '../../../utils/swagger-schemas/transactions/schema-list-by-user-id'
import { schemaListTransactionsByAccountNumber } from '../../../utils/swagger-schemas/transactions/schema-list-by-account-number'
import { schemaExpenseCreate } from '../../../utils/swagger-schemas/transactions/schema-expense-create'
import { schemaExpenseDelete } from '../../../utils/swagger-schemas/transactions/schema-expense-delete'
import { schemaIncomeCreate } from '../../../utils/swagger-schemas/transactions/schema-income-create'
import { schemaIncomeDelete } from '../../../utils/swagger-schemas/transactions/schema-income-delete'

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/transactions', { schema: schemaListByUserId }, listByUserId)
  app.get(
    '/transactions/by-account',
    { schema: schemaListTransactionsByAccountNumber },
    listTransactionsByAccountNumber,
  )

  app.post('/expenses/create', { schema: schemaExpenseCreate }, expenseCreate)
  app.delete('/expenses/delete', { schema: schemaExpenseDelete }, expenseDelete)

  app.post('/incomes/create', { schema: schemaIncomeCreate }, incomeCreate)
  app.delete('/incomes/delete', { schema: schemaIncomeDelete }, incomeDelete)
}
