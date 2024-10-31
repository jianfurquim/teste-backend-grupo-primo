import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { RegisterService } from '../../services/register'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from '../../services/errors/user-already-exists.error'

export async function register(request: FastifyRequest, replay: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const registerService = new RegisterService(usersRepository)

    await registerService.execute({
      name,
      email,
      password,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
        return replay.status(409).send({message: err.message })
    }
    
    return replay.status(500).send({ message: 'Internal server error.' })
  }

  return replay.status(201).send({
    detail: 'User created success.',
  })
}
