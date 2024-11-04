import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { TransactionType } from '@prisma/client'
import { TransactionsService } from '../../../services/transactions'
import { createAndAuthenticateUser } from '../../../utils/create-and-authenticate-user'

describe('Create Expense (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create expenses', async () => {
    const mockTransaction = {
      id: 'transaction1',
      amount: 300.5,
      accountNumber: 1234,
      transactionType: TransactionType.EXPENSE,
      createdAt: new Date(),
    }

    vi.spyOn(TransactionsService.prototype, 'create').mockResolvedValue({
      transaction: mockTransaction,
    })

    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/expenses/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 300.5,
        accountNumber: 1234,
      })

    expect(response.statusCode).toEqual(202)
    expect(response.body).toEqual({
      message: expect.any(String),
      issues: {
        id: mockTransaction.id,
        accountNumber: mockTransaction.accountNumber,
        amount: mockTransaction.amount,
        transactionType: mockTransaction.transactionType,
        created_at: expect.any(String),
      },
    })
  })
})
