import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { schemaRegister } from '../../../utils/swagger-schemas/users/schema-register'
import { schemaAuthenticate } from '../../../utils/swagger-schemas/users/schema-authenticate'

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    '/register',
    {
      schema: schemaRegister,
    },
    register,
  )
  app.post(
    '/authenticate',
    {
      schema: schemaAuthenticate,
    },
    authenticate,
  )
}
