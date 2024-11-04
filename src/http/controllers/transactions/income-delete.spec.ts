import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { createAndAuthenticateUser } from '../../../utils/create-and-authenticate-user'
import { TransactionType } from '@prisma/client'
import { TransactionsService } from '../../../services/transactions'

describe('Delete Income (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete incomes', async () => {
    const mockCreateTransaction = {
      id: 'income1',
      amount: 300.5,
      accountNumber: 1234,
      transactionType: TransactionType.INCOME,
      createdAt: new Date(),
    }

    const mockDeleteTransaction = {
      id: 'income1',
      amount: 300.5,
      accountNumber: 1234,
      transactionType: TransactionType.INCOME,
      createdAt: new Date(),
    }

    vi.spyOn(TransactionsService.prototype, 'create').mockResolvedValue({
      transaction: mockCreateTransaction,
    })

    vi.spyOn(TransactionsService.prototype, 'delete').mockResolvedValue({
      deleted_transaction: mockDeleteTransaction,
    })

    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/incomes/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: mockCreateTransaction.amount,
        accountNumber: mockCreateTransaction.accountNumber,
      })

    // Agora, tenta deletar a despesa com o mock
    const response = await request(app.server)
      .delete(`/incomes/delete?id=${mockCreateTransaction.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(202)
    expect(response.body).toEqual({
      message: expect.any(String),
      issues: {
        id: mockDeleteTransaction.id,
        accountNumber: mockDeleteTransaction.accountNumber,
        amount: mockDeleteTransaction.amount,
        transactionType: mockDeleteTransaction.transactionType,
        created_at: expect.any(String),
      },
    })
  })
})
