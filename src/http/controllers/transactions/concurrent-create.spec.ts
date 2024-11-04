import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '../../../utils/create-and-authenticate-user'

describe('Concurrent Create Transactions (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able handle concurrent transactions correctly', async () => {
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

    const accountNumber = createAccountResponse.body.issues.number

    const debitTransaction = {
      amount: 500,
      transactionType: 'EXPENSE',
      accountNumber,
    }

    const creditTransaction = {
      amount: 1000,
      transactionType: 'INCOME',
      accountNumber,
    }

    const debitPromise = request(app.server)
      .post('/expenses/create')
      .set('Authorization', `Bearer ${token}`)
      .send(debitTransaction)

    const creditPromise = request(app.server)
      .post('/incomes/create')
      .set('Authorization', `Bearer ${token}`)
      .send(creditTransaction)

    await Promise.all([debitPromise, creditPromise])

    const getAccountResponse = await request(app.server)
      .get(`/accounts/by-number?accountNumber=${accountNumber}`)
      .set('Authorization', `Bearer ${token}`)

    expect(getAccountResponse.statusCode).toBe(202)

    const finalBalance = getAccountResponse.body.issues.balance
    expect(finalBalance).toEqual(5500)
  })
})
