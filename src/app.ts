import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import fastifyJwt from '@fastify/jwt'
import { env } from './env/index'

export const app = fastify()

app.register(appRoutes)

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
