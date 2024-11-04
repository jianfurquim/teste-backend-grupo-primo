import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryAccountsRepository } from '../repositories/in-memory/in-memory-accounts-repository'
import { InMemoryTransactionsRepository } from '../repositories/in-memory/in-memory-transactions-repository'
import { TransactionsService } from './transactions'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InvalidBalanceValueError } from './errors/invalid-balance-value-error'

let usersRepository: InMemoryUsersRepository
let accountsRepository: InMemoryAccountsRepository
let transactionsRepository: InMemoryTransactionsRepository
let sut: TransactionsService

describe('Transactions Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    accountsRepository = new InMemoryAccountsRepository()
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = new TransactionsService(accountsRepository, transactionsRepository)
  })

  it('should be able to create transaction', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const account = await accountsRepository.create({
      id: 'account-1',
      name: 'Bank Account',
      number: 1234,
      balance: 0.0,
      userId: user.id,
    })

    const { transaction } = await sut.create({
      id: 'transaction-1',
      amount: 0.0,
      transactionType: 'EXPENSE',
      accountNumber: account.number,
    })

    expect(transaction.id).toEqual(expect.any(String))
  })

  it('should not be able to create a transaction without passing the id account', async () => {
    const account_number = 6666

    await expect(() =>
      sut.create({
        id: 'transaction-1',
        amount: 0.0,
        transactionType: 'EXPENSE',
        accountNumber: account_number,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create transaction with negative ammout', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const account = await accountsRepository.create({
      id: 'account-1',
      name: 'Bank Account',
      number: 1234,
      balance: 0.0,
      userId: user.id,
    })

    await expect(() =>
      sut.create({
        id: 'transaction-1',
        amount: -5.0,
        transactionType: 'EXPENSE',
        accountNumber: account.number,
      }),
    ).rejects.toBeInstanceOf(InvalidBalanceValueError)
  })
})
