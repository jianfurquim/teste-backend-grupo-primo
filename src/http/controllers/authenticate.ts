import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '../../services/errors/invalid-credentials-error'
import { makeAuthenticateService } from '../../services/factories/make-authenticate-service'

export async function authenticate(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateService = makeAuthenticateService()

    const { user } = await authenticateService.execute({
      email,
      password,
    })

    return replay.status(202).send({
      message: 'User authenticated with success.',
      issues: {
        user: user.name,
        id: user.id,
      },
    })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return replay.status(400).send({
        message: err.message,
        issues: {},
      })
    }

    throw err
  }
}
