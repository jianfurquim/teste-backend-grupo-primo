import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '../../services/errors/user-already-exists.error'
import { makeRegisterService } from '../../services/factories/make-register-service'

export async function register(request: FastifyRequest, replay: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerService = makeRegisterService()

    const { user } = await registerService.execute({
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
      return replay.status(409).send({ message: err.message, issues: {} })
    }

    throw err
  }
}
