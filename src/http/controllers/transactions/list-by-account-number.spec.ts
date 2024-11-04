import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { TransactionsService } from '../../../services/transactions'
import { TransactionType } from '@prisma/client'
import { createAndAuthenticateUser } from '../../../utils/create-and-authenticate-user'

describe('Transactions Accounts (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a list transactions by account number', async () => {
    const mockTransactions = [
      {
        id: 'transaction1',
        amount: 1000,
        createdAt: new Date(),
        accountNumber: 1234,
        transactionType: TransactionType.EXPENSE,
      },
      {
        id: 'transaction2',
        amount: 1000,
        createdAt: new Date(),
        accountNumber: 1234,
        transactionType: TransactionType.INCOME,
      },
    ]

    vi.spyOn(TransactionsService.prototype, 'list').mockResolvedValue({
      transactions: mockTransactions,
    })

    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .get('/transactions/by-account?accountNumber=1234&page=1')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(202)
    expect(response.body).toEqual({
      message: expect.any(String),
      issues: {
        transactions: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            amount: expect.any(Number),
            createdAt: expect.any(String),
            accountNumber: expect.any(Number),
            transactionType: expect.any(String),
          }),
        ]),
      },
    })
    expect(TransactionsService.prototype.list).toHaveBeenCalledWith({
      accountNumber: 1234,
      page: 1,
    })
  })
})
