import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeAccountsService } from '../../services/factories/make-accounts-service'
import { ResourceNotFoundError } from '../../services/errors/resource-not-found-error'

export async function list_account(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const registerBodySchema = z.object({
    page: z.coerce.number(),
  })

  const { page } = registerBodySchema.parse(request.query)

  try {
    const accountsService = makeAccountsService()

    const { accounts } = await accountsService.list({
      userId: request.user.sub,
      page,
    })

    return replay.status(202).send({
      message: 'List accounts.',
      issues: {
        accounts,
      },
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return replay.status(409).send({ message: err.message, issues: {} })
    }

    throw err
  }
}
