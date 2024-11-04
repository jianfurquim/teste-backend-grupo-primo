import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '../../../services/errors/resource-not-found-error'
import { makeTransactionsService } from '../../../services/factories/make-transactions-service'

export async function expenseDelete(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const deleteParamSchema = z.object({
    id: z.string(),
  })

  const { id } = deleteParamSchema.parse(request.query)

  try {
    const transactionsService = makeTransactionsService()

    const { deleted_transaction } = await transactionsService.delete({
      transactionId: id,
    })

    if (!deleted_transaction) {
      return replay.status(404).send({
        message: new ResourceNotFoundError().message,
        issues: {},
      })
    }

    return replay.status(202).send({
      message: 'Expense deleted successfully.',
      issues: {
        id: deleted_transaction.id,
        accountNumber: deleted_transaction.accountNumber,
        amount: deleted_transaction.amount,
        transactionType: deleted_transaction.transactionType,
        created_at: deleted_transaction.createdAt,
      },
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return replay.status(404).send({ message: err.message, issues: {} })
    }

    throw err
  }
}
