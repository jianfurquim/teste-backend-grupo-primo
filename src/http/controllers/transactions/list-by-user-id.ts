import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '../../../services/errors/resource-not-found-error'
import { makeTransactionsService } from '../../../services/factories/make-transactions-service'

export async function listByUserId(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const registerBodySchema = z.object({
    page: z.coerce.number(),
  })

  const { page } = registerBodySchema.parse(request.query)

  try {
    const transactionsService = makeTransactionsService()

    const { transactions } = await transactionsService.listByUserId({
      userId: request.user.sub,
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
