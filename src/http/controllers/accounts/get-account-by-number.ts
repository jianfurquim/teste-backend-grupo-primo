import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeAccountsService } from '../../../services/factories/make-accounts-service'
import { ResourceNotFoundError } from '../../../services/errors/resource-not-found-error'

export async function getAccountByNumber(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const registerBodySchema = z.object({
    accountNumber: z.coerce.number(),
  })

  const { accountNumber } = registerBodySchema.parse(request.query)

  try {
    const accountsService = makeAccountsService()

    const { account } = await accountsService.getAccountByNumber({
      number: accountNumber,
    })

    return replay.status(202).send({
      message: 'Your Account.',
      issues: {
        id: account.id,
        account: account.name,
        number: account.number,
      },
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return replay.status(404).send({ message: err.message, issues: {} })
    }

    throw err
  }
}
