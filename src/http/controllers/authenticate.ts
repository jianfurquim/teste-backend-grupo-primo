import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '../../services/errors/invalid-credentials-error'
import { makeUsersService } from '../../services/factories/make-users-service'

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
    const usersService = makeUsersService()

    const { user } = await usersService.authenticate({
      email,
      password,
    })

    const token = await replay.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    return replay.status(202).send({
      message: 'User authenticated with success.',
      issues: {
        user: user.email,
        token,
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
