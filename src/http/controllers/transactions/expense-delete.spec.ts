import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { createAndAuthenticateUser } from '../../../utils/create-and-authenticate-user'
import { TransactionType } from '@prisma/client'
import { TransactionsService } from '../../../services/transactions'

describe('Delete Expense (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete expenses', async () => {
    const mockCreateTransaction = {
      id: 'expense1',
      amount: 300.5,
      accountNumber: 1234,
      transactionType: TransactionType.EXPENSE,
      createdAt: new Date(),
    }

    const mockDeleteTransaction = {
      id: 'expense1',
      amount: 300.5,
      accountNumber: 1234,
      transactionType: TransactionType.EXPENSE,
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
      .post('/expenses/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: mockCreateTransaction.amount,
        accountNumber: mockCreateTransaction.accountNumber,
      })

    // Agora, tenta deletar a despesa com o mock
    const response = await request(app.server)
      .delete(`/expenses/delete?id=${mockCreateTransaction.id}`)
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
