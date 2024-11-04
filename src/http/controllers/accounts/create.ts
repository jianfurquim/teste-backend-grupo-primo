import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeAccountsService } from '../../../services/factories/make-accounts-service'
import { ResourceNotFoundError } from '../../../services/errors/resource-not-found-error'
import { InvalidBalanceValueError } from '../../../services/errors/invalid-balance-value-error'

export async function create(request: FastifyRequest, replay: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    number: z.coerce.number(),
    balance: z.number(),
  })

  const { name, number, balance } = registerBodySchema.parse(request.body)

  try {
    const accountsService = makeAccountsService()

    const { account } = await accountsService.create({
      name,
      number,
      balance,
      userId: request.user.sub,
    })

    return replay.status(202).send({
      message: 'Account created with success.',
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

    if (err instanceof InvalidBalanceValueError) {
      return replay.status(409).send({ message: err.message, issues: {} })
    }

    throw err
  }
}
