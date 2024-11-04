import fastify from 'fastify'
import { ZodError } from 'zod'
import fastifyJwt from '@fastify/jwt'
import { env } from './env/index'
import { usersRoutes } from './http/controllers/users/routes'
import { accountsRoutes } from './http/controllers/accounts/routes'

export const app = fastify()

app.register(usersRoutes)
app.register(accountsRoutes)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.setErrorHandler((error, _, replay) => {
  if (error instanceof ZodError) {
    replay
      .status(400)
      .send({ message: 'Validation Error', issues: error.format() })
  }

  return replay.status(500).send({ message: 'Internal server error.' })
})
