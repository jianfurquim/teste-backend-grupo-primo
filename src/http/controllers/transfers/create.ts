import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '../../../services/errors/resource-not-found-error'
import { InvalidBalanceValueError } from '../../../services/errors/invalid-balance-value-error'
import { makeTransfersService } from '../../../services/factories/make-transfers-service'

export async function create(request: FastifyRequest, replay: FastifyReply) {
  const registerBodySchema = z.object({
    fromNumber: z.coerce.number(),
    toNumber: z.coerce.number(),
    amount: z.coerce.number(),
  })

  const { fromNumber, toNumber, amount } = registerBodySchema.parse(
    request.body,
  )

  try {
    const transfersService = makeTransfersService()

    const { transfer } = await transfersService.create({
      fromNumber,
      toNumber,
      amount,
    })

    return replay.status(202).send({
      message: 'Transfer created with success.',
      issues: {
        id: transfer.id,
        fromId: transfer.fromId,
        toId: transfer.toId,
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
