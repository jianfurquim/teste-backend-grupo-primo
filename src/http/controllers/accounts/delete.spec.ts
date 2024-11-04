import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '../../../utils/create-and-authenticate-user'

describe('Delete Accounts (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete an account', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const createResponse = await request(app.server)
      .post('/accounts/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Accont Test',
        number: 1234,
        balance: 200.5,
      })

    const { issues: accountIssues } = createResponse.body

    const response = await request(app.server)
      .delete(`/accounts/delete?id=${accountIssues.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      message: expect.any(String),
      issues: expect.objectContaining({
        account: expect.any(String),
        id: expect.any(String),
        number: expect.any(Number),
      }),
    })
  })
})
