import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/register').send({
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: '123456',
  })

  const authResponse = await request(app.server).post('/authenticate').send({
    email: 'johndoe@gmail.com',
    password: '123456',
  })

  const { issues } = authResponse.body

  return {
    token: issues.token,
  }
}
