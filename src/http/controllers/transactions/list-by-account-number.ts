import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeTransactionsService } from '../../../services/factories/make-transactions-service'
import { ResourceNotFoundError } from '../../../services/errors/resource-not-found-error'

export async function listTransactionsByAccountNumber(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const registerBodySchema = z.object({
    accountNumber: z.coerce.number(),
    page: z.coerce.number(),
  })

  const { accountNumber, page } = registerBodySchema.parse(request.query)

  try {
    const transactionsService = makeTransactionsService()

    const { transactions } = await transactionsService.list({
      accountNumber,
      page,
    })

    return replay.status(202).send({
      message: 'List transactions.',
      issues: {
        transactions,
      },
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return replay.status(404).send({ message: err.message, issues: {} })
    }

    throw err
  }
}
