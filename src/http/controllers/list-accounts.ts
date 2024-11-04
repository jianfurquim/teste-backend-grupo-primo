import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeAccountsService } from '../../services/factories/make-accounts-service'
import { ResourceNotFoundError } from '../../services/errors/resource-not-found-error'

export async function list_account(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  await request.jwtVerify()
  const userId = request.user.sub

  const registerBodySchema = z.object({
    page: z.coerce.number(),
  })

  const { page } = registerBodySchema.parse(request.query)

  try {
    const accountsService = makeAccountsService()

    const { accounts } = await accountsService.list({
      userId,
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
