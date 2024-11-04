import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '../../../services/errors/resource-not-found-error'
import { makeTransfersService } from '../../../services/factories/make-transfers-service'

export async function tranferDelete(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const deleteParamSchema = z.object({
    id: z.string(),
  })

  const { id } = deleteParamSchema.parse(request.query)

  try {
    const transfersService = makeTransfersService()

    const { deleted_transfer } = await transfersService.delete({
      transferId: id,
    })

    if (!deleted_transfer) {
      return replay.status(404).send({
        message: new ResourceNotFoundError().message,
        issues: {},
      })
    }

    return replay.status(202).send({
      message: 'Transfer deleted successfully.',
      issues: {
        id: deleted_transfer.id,
        fromId: deleted_transfer.fromId,
        toId: deleted_transfer.toId,
      },
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return replay.status(404).send({ message: err.message, issues: {} })
    }

    throw err
  }
}
