import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, _, replay) => {
  if (error instanceof ZodError) {
    replay
      .status(400)
      .send({ message: 'Validation Error', issues: error.format() })
  }

  return replay.status(500).send({ message: 'Internal server error.' })
})
