import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryAccountsRepository } from '../repositories/in-memory/in-memory-accounts-repository'
import { InMemoryTransactionsRepository } from '../repositories/in-memory/in-memory-transactions-repository'
import { TransfersService } from './transfers'
import { InMemoryTransfersRepository } from '../repositories/in-memory/in-memory-transfers-repository'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let accountsRepository: InMemoryAccountsRepository
let transactionsRepository: InMemoryTransactionsRepository
let transfersRepository: InMemoryTransfersRepository
let sut: TransfersService

describe('Transfers Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    accountsRepository = new InMemoryAccountsRepository()
    transactionsRepository = new InMemoryTransactionsRepository()
    transfersRepository = new InMemoryTransfersRepository()
    sut = new TransfersService(
      transfersRepository,
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

    const accountFrom = await accountsRepository.create({
      name: 'Bank Account From',
      number: 1234,
      balance: 500,
      userId: user.id,
    })

    const accountTo = await accountsRepository.create({
      name: 'Bank Account To',
      number: 4321,
      balance: 500,
      userId: user.id,
    })

    const { transfer } = await sut.create({
      fromNumber: accountFrom.number,
      toNumber: accountTo.number,
      amount: 50,
    })

    expect(transfer.id).toEqual(expect.any(String))
  })

  it('should not be able to create a transfer without passing the EXPENSE account number', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const account_number_from = 6666

    const accountTo = await accountsRepository.create({
      name: 'Bank Account To',
      number: 4321,
      balance: 500,
      userId: user.id,
    })

    await expect(() =>
      sut.create({
        fromNumber: account_number_from,
        toNumber: accountTo.number,
        amount: 50,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create a transfer without passing the INCOME account number', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const accountFrom = await accountsRepository.create({
      name: 'Bank Account From',
      number: 1234,
      balance: 500,
      userId: user.id,
    })

    const account_number_to = 6666

    await expect(() =>
      sut.create({
        fromNumber: accountFrom.number,
        toNumber: account_number_to,
        amount: 50,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to delete tranfer', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const accountFrom = await accountsRepository.create({
      name: 'Bank Account From',
      number: 1234,
      balance: 500,
      userId: user.id,
    })

    const accountTo = await accountsRepository.create({
      name: 'Bank Account To',
      number: 4321,
      balance: 500,
      userId: user.id,
    })

    const { transfer } = await sut.create({
      fromNumber: accountFrom.number,
      toNumber: accountTo.number,
      amount: 50,
    })

    await sut.delete({
      transferId: transfer.id,
    })

    expect(await transfersRepository.findById(transfer.id)).toBeNull()
  })

  it('should be not able to delete a transfer without passing the id transfer', async () => {
    const transfer_id = 'id_do_not_exists'

    await expect(() =>
      sut.delete({
        transferId: transfer_id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
