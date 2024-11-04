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
    sut = new TransactionsService(
      usersRepository,
      accountsRepository,
      transactionsRepository,
    )
  })

  it('should be able to create transaction', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const account = await accountsRepository.create({
      name: 'Bank Account',
      number: 1234,
      balance: 0.0,
      userId: user.id,
    })

    const { transaction } = await sut.create({
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
        amount: 0.0,
        transactionType: 'EXPENSE',
        accountNumber: account_number,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create transaction with negative amount', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const account = await accountsRepository.create({
      name: 'Bank Account',
      number: 1234,
      balance: 0.0,
      userId: user.id,
    })

    await expect(() =>
      sut.create({
        amount: -5.0,
        transactionType: 'EXPENSE',
        accountNumber: account.number,
      }),
    ).rejects.toBeInstanceOf(InvalidBalanceValueError)
  })

  it('should be able to return a transactions list', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const account = await accountsRepository.create({
      name: 'Bank Account 1',
      number: 1234,
      balance: 0.0,
      userId: user.id,
    })

    await sut.create({
      amount: 100.0,
      transactionType: 'EXPENSE',
      accountNumber: account.number,
    })

    await sut.create({
      amount: 200.0,
      transactionType: 'INCOME',
      accountNumber: account.number,
    })

    const { transactions } = await sut.list({
      accountNumber: account.number,
      page: 1,
    })

    expect(transactions).toHaveLength(2)
    expect(transactions).toEqual([
      expect.objectContaining({
        amount: 100.0,
        transactionType: 'EXPENSE',
        accountNumber: account.number,
      }),
      expect.objectContaining({
        amount: 200.0,
        transactionType: 'INCOME',
        accountNumber: account.number,
      }),
    ])
  })

  it('should be not able to transactions list without passing the number account', async () => {
    const number_account = 6666

    await expect(() =>
      sut.list({
        accountNumber: number_account,
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to make pagination in transactions list', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const account = await accountsRepository.create({
      name: 'Bank Account 1',
      number: 1234,
      balance: 0.0,
      userId: user.id,
    })

    for (let i = 0; i < 22; i++) {
      await sut.create({
        amount: i,
        transactionType: 'INCOME',
        accountNumber: account.number,
      })
    }

    const { transactions } = await sut.list({
      accountNumber: account.number,
      page: 2,
    })
    expect(transactions).toHaveLength(2)
    expect(transactions).toEqual([
      expect.objectContaining({
        amount: 20,
        transactionType: 'INCOME',
        accountNumber: account.number,
      }),
      expect.objectContaining({
        amount: 21,
        transactionType: 'INCOME',
        accountNumber: account.number,
      }),
    ])
  })

  it('should be able to return a transactions list by user id', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const account = await accountsRepository.create({
      name: 'Bank Account 1',
      number: 1234,
      balance: 0.0,
      userId: user.id,
    })

    await sut.create({
      amount: 100.0,
      transactionType: 'EXPENSE',
      accountNumber: account.number,
    })

    await sut.create({
      amount: 200.0,
      transactionType: 'INCOME',
      accountNumber: account.number,
    })

    const { transactions } = await sut.listByUserId({
      userId: user.id,
      page: 1,
    })

    expect(transactions).toHaveLength(2)
    expect(transactions).toEqual([
      expect.objectContaining({
        amount: 100.0,
        transactionType: 'EXPENSE',
        accountNumber: account.number,
      }),
      expect.objectContaining({
        amount: 200.0,
        transactionType: 'INCOME',
        accountNumber: account.number,
      }),
    ])
  })

  it('should be not able to transactions list by id user without passing the id user', async () => {
    const user_id = 'id_do_not_exists'

    await expect(() =>
      sut.listByUserId({
        userId: user_id,
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to make pagination in transactions list by user id', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const account = await accountsRepository.create({
      name: 'Bank Account 1',
      number: 1234,
      balance: 0.0,
      userId: user.id,
    })

    for (let i = 0; i < 22; i++) {
      await sut.create({
        amount: i,
        transactionType: 'INCOME',
        accountNumber: account.number,
      })
    }

    const { transactions } = await sut.listByUserId({
      userId: user.id,
      page: 2,
    })
    expect(transactions).toHaveLength(2)
    expect(transactions).toEqual([
      expect.objectContaining({
        amount: 20,
        transactionType: 'INCOME',
        accountNumber: account.number,
      }),
      expect.objectContaining({
        amount: 21,
        transactionType: 'INCOME',
        accountNumber: account.number,
      }),
    ])
  })

  it('should be able to delete transaction', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const account = await accountsRepository.create({
      name: 'Bank Account 1',
      number: 1234,
      balance: 0.0,
      userId: user.id,
    })

    const { transaction } = await sut.create({
      amount: 200.0,
      transactionType: 'INCOME',
      accountNumber: account.number,
    })

    await sut.delete({
      transactionId: transaction.id,
    })

    expect(await transactionsRepository.findById(transaction.id)).toBeNull()
  })

  it('should be not able to delete a transaction without passing the id transaction', async () => {
    const transaction_id = 'id_do_not_exists'

    await expect(() =>
      sut.delete({
        transactionId: transaction_id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
