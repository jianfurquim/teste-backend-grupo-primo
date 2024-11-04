import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '../../../utils/create-and-authenticate-user'

describe('Get Account using account Number (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get account with number', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const createAccountResponse = await request(app.server)
      .post('/accounts/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Account',
        number: 1234,
        balance: 5000,
      })

    expect(createAccountResponse.statusCode).toBe(202)

    const response = await request(app.server)
      .get(`/accounts/by-number?accountNumber=1234`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(202)
    expect(response.body).toEqual({
      message: expect.any(String),
      issues: {
        account: expect.any(String),
        number: expect.any(Number),
        balance: expect.any(Number),
      },
    })
  })
})
