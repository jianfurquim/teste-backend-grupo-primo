import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '../../../services/errors/resource-not-found-error'
import { InvalidBalanceValueError } from '../../../services/errors/invalid-balance-value-error'
import { makeTransactionsService } from '../../../services/factories/make-transactions-service'
import { TransactionType } from '@prisma/client'

export async function expenseCreate(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const registerBodySchema = z.object({
    amount: z.number(),
    accountNumber: z.number(),
  })

  const { amount, accountNumber } = registerBodySchema.parse(request.body)

  try {
    const transactionsService = makeTransactionsService()

    const { transaction } = await transactionsService.create({
      amount,
      transactionType: TransactionType.EXPENSE,
      accountNumber,
    })

    return replay.status(202).send({
      message: 'Expense created with success.',
      issues: {
        id: transaction.id,
        accountNumber: transaction.accountNumber,
        amount: transaction.amount,
        transactionType: transaction.transactionType,
        created_at: transaction.createdAt,
      },
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return replay.status(404).send({ message: err.message, issues: {} })
    }

    if (err instanceof InvalidBalanceValueError) {
      return replay.status(409).send({ message: err.message, issues: {} })
    }

    throw err
  }
}
