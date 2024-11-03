import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeAccountsService } from '../../services/factories/make-accounts-service'
import { ResourceNotFoundError } from '../../services/errors/resource-not-found-error'
import { InvalidBalanceValueError } from '../../services/errors/invalid-balance-value-error'

export async function create_account(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    balance: z.number(),
    userId: z.string(),
  })

  const { name, balance, userId } = registerBodySchema.parse(request.body)

  try {
    const accountsService = makeAccountsService()

    const { account } = await accountsService.create({
      name,
      balance,
      userId,
    })

    return replay.status(202).send({
      message: 'Account created with success.',
      issues: {
        account: account.name,
        id: account.id,
      },
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return replay.status(409).send({ message: err.message, issues: {} })
    }

    if (err instanceof InvalidBalanceValueError) {
      return replay.status(409).send({ message: err.message, issues: {} })
    }

    throw err
  }
}
