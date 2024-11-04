import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Accounts (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create accounts', async () => {
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

    const createResponse = await request(app.server)
      .post('/accounts/create')
      .set('Authorization', `Bearer ${issues.token}`)
      .send({
        name: 'Accont Test',
        number: 1234,
        balance: 200.5,
      })

    expect(createResponse.statusCode).toEqual(202)
    expect(createResponse.body).toEqual({
      message: expect.any(String),
      issues: {
        id: expect.any(String),
        account: expect.any(String),
        number: expect.any(Number),
      },
    })
  })
})
