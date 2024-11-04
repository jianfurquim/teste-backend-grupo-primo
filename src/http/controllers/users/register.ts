import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '../../../services/errors/user-already-exists.error'
import { makeUsersService } from '../../../services/factories/make-users-service'

export async function register(request: FastifyRequest, replay: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const usersService = makeUsersService()

    const { user } = await usersService.register({
      name,
      email,
      password,
    })

    return replay.status(202).send({
      message: 'User created with success.',
      issues: {
        user: user.name,
        id: user.id,
      },
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return replay.status(404).send({ message: err.message, issues: {} })
    }

    throw err
  }
}
