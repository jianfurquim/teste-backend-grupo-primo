import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeAccountsService } from '../../../services/factories/make-accounts-service'
import { ResourceNotFoundError } from '../../../services/errors/resource-not-found-error'

export async function deleteAccount(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const deleteParamSchema = z.object({
    id: z.string(),
  })

  const { id } = deleteParamSchema.parse(request.query)

  try {
    const accountsService = makeAccountsService()

    const { deleted_account } = await accountsService.delete({
      accountId: id,
    })

    if (!deleted_account) {
      return replay.status(404).send({
        message: new ResourceNotFoundError().message,
        issues: {},
      })
    }

    return replay.status(200).send({
      message: 'Account deleted successfully.',
      issues: {
        account: deleted_account.name,
        id: deleted_account.id,
        number: deleted_account.number,
      },
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return replay.status(404).send({ message: err.message, issues: {} })
    }

    throw err
  }
}
