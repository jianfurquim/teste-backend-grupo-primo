import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryAccountsRepository } from '../repositories/in-memory/in-memory-accounts-repository'
import { AccountsService } from './accounts'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InvalidBalanceValueError } from './errors/invalid-balance-value-error'

let accountRepository: InMemoryAccountsRepository
let usersRepository: InMemoryUsersRepository
let sut: AccountsService

describe('Create Accounts Service', () => {
  beforeEach(() => {
    accountRepository = new InMemoryAccountsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new AccountsService(accountRepository, usersRepository)
  })

  it('should be able to create account', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const { account } = await sut.create({
      id: 'account-1',
      name: 'Bank Account',
      balance: 0.0,
      userId: user.id,
    })

    expect(account.id).toEqual(expect.any(String))
  })

  it('should not be able to create account with negative balance', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    await expect(() =>
      sut.create({
        id: 'account-1',
        name: 'Bank Account',
        balance: -5.0,
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(InvalidBalanceValueError)
  })

  it('should not be able to create an account without passing the id user', async () => {
    const user_id = 'id_do_not_exists'

    await expect(() =>
      sut.create({
        id: 'account-1',
        name: 'Bank Account',
        balance: 0.0,
        userId: user_id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to delete account', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const { account } = await sut.create({
      id: 'account-1',
      name: 'Bank Account',
      balance: 0.0,
      userId: user.id,
    })

    await sut.delete({
      accountId: account.id,
    })

    expect(await accountRepository.findById(account.id)).toBeNull()
  })

  it('should be not able to delete an account without passing the id account', async () => {
    const account_id = 'id_do_not_exists'

    await expect(() =>
      sut.delete({
        accountId: account_id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to return a accounts list', async () => {
    const user = await usersRepository.create({
      id: 'user-1',
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    await sut.create({
      id: 'account-1',
      name: 'Bank Account 1',
      balance: 0.0,
      userId: user.id,
    })

    await sut.create({
      id: 'account-2',
      name: 'Bank Account 2',
      balance: 0.0,
      userId: user.id,
    })

    const { accounts } = await sut.list({ userId: user.id, page: 1 })

    expect(accounts).toHaveLength(2)
    expect(accounts).toEqual([
      expect.objectContaining({ id: 'account-1' }),
      expect.objectContaining({ id: 'account-2' }),
    ])
  })

  it('should be not able to accounts list without passing the id user', async () => {
    const user_id = 'id_do_not_exists'

    await expect(() =>
      sut.list({
        userId: user_id,
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to make pagination in accounts list', async () => {
    const user = await usersRepository.create({
      id: 'user-1',
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    for (let i = 0; i < 22; i++) {
      await sut.create({
        id: `account-${i}`,
        name: 'Bank Account 1',
        balance: 0.0,
        userId: user.id,
      })
    }

    const { accounts } = await sut.list({ userId: user.id, page: 2 })
    expect(accounts).toHaveLength(2)
    expect(accounts).toEqual([
      expect.objectContaining({ id: 'account-20' }),
      expect.objectContaining({ id: 'account-21' }),
    ])
  })
})
