import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { AccountsService } from '../../../services/accounts'

describe('List Accounts (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a list accounts', async () => {
    const mockAccounts = [
      {
        id: 'account1',
        name: 'Test 1 Account',
        number: 123456,
        balance: 1000,
        userId: 'user1',
      },
      {
        id: 'account2',
        name: 'Test 2 Account',
        number: 654321,
        balance: 500,
        userId: 'user1',
      },
    ]

    vi.spyOn(AccountsService.prototype, 'list').mockResolvedValue({
      accounts: mockAccounts,
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

    const listAccountsResponse = await request(app.server)
      .get('/accounts?page=1')
      .set('Authorization', `Bearer ${issues.token}`)

    expect(listAccountsResponse.statusCode).toEqual(202)
    expect(listAccountsResponse.body).toEqual({
      message: expect.any(String),
      issues: {
        accounts: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            number: expect.any(Number),
            balance: expect.any(Number),
          }),
        ]),
      },
    })
  })
})
