import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { TransactionsService } from '../../../services/transactions'
import { TransactionType } from '@prisma/client'

describe('Transactions Accounts (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a list transactions', async () => {
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

    vi.spyOn(TransactionsService.prototype, 'listByUserId').mockResolvedValue({
      transactions: mockTransactions,
    })

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

    const listTransactionsResponse = await request(app.server)
      .get('/transactions?page=1')
      .set('Authorization', `Bearer ${issues.token}`)

    expect(listTransactionsResponse.statusCode).toEqual(202)
    expect(listTransactionsResponse.body).toEqual({
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
    expect(TransactionsService.prototype.listByUserId).toHaveBeenCalledWith({
      userId: expect.any(String),
      page: 1,
    })
  })
})
