import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '../../../utils/create-and-authenticate-user'

describe('Create Accounts (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create accounts', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/accounts/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Accont Test',
        number: 1234,
        balance: 200.5,
      })

    expect(response.statusCode).toEqual(202)
    expect(response.body).toEqual({
      message: expect.any(String),
      issues: {
        id: expect.any(String),
        account: expect.any(String),
        number: expect.any(Number),
      },
    })
  })
})
