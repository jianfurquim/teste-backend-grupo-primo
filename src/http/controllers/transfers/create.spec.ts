import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { createAndAuthenticateUser } from '../../../utils/create-and-authenticate-user'
import { AccountsService } from '../../../services/accounts'
import { TransfersService } from '../../../services/transfers'

describe('Create Transfers (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create transfers', async () => {
    const mockCreateAccount1 = {
      id: 'account-id-1',
      name: 'account-1',
      number: 1234,
      balance: 5000,
      userId: 'user-id-1',
    }

    const mockCreateAccount2 = {
      id: 'account-id-2',
      name: 'account-2',
      number: 4321,
      balance: 5000,
      userId: 'user-id-2',
    }

    const mockCreateTransfer = {
      id: 'transfer-id-1',
      fromNumber: 1234,
      toNumber: 4321,
      amount: 1000,
      fromId: 'account-id-1',
      toId: 'account-id-2',
    }

    const createSpy = vi.spyOn(AccountsService.prototype, 'create')
    createSpy.mockResolvedValueOnce({ account: mockCreateAccount1 })
    createSpy.mockResolvedValueOnce({ account: mockCreateAccount2 })

    vi.spyOn(TransfersService.prototype, 'create').mockResolvedValue({
      transfer: mockCreateTransfer,
    })

    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/transfers/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fromNumber: 1234,
        toNumber: 4321,
        amount: 1000,
      })

    expect(response.statusCode).toEqual(202)
    expect(response.body).toEqual({
      message: expect.any(String),
      issues: {
        id: mockCreateTransfer.id,
        fromId: mockCreateTransfer.fromId,
        toId: mockCreateTransfer.toId,
      },
    })
  })
})
