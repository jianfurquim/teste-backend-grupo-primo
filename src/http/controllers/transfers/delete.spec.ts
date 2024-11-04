import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { createAndAuthenticateUser } from '../../../utils/create-and-authenticate-user'
import { TransfersService } from '../../../services/transfers'

describe('Delete Transfer (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete tranfers', async () => {
    const mockCreateTransfer = {
      id: 'transfer-created',
      fromNumber: 1234,
      toNumber: 4321,
      amount: 500,
      fromId: 'account-id-1',
      toId: 'account-id-2',
    }

    const mockDeleteTransfer = {
      id: 'transfer-deleted',
      fromNumber: 1234,
      toNumber: 4321,
      amount: 500,
      fromId: 'account-id-1',
      toId: 'account-id-2',
    }

    vi.spyOn(TransfersService.prototype, 'create').mockResolvedValue({
      transfer: mockCreateTransfer,
    })

    vi.spyOn(TransfersService.prototype, 'delete').mockResolvedValue({
      deleted_transfer: mockDeleteTransfer,
    })

    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/tranfers/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fromNumber: mockCreateTransfer.fromNumber,
        toNumber: mockCreateTransfer.toNumber,
        amount: mockCreateTransfer.amount,
      })

    // Agora, tenta deletar a despesa com o mock
    const response = await request(app.server)
      .delete(`/transfers/delete?id=${mockCreateTransfer.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(202)
    expect(response.body).toEqual({
      message: expect.any(String),
      issues: {
        id: mockDeleteTransfer.id,
        fromId: mockDeleteTransfer.fromId,
        toId: mockDeleteTransfer.toId,
      },
    })
  })
})
