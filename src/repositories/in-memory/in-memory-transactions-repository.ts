import { Transaction, Prisma } from '@prisma/client'
import { TransactionsRepository } from '../transactions-repository'
import { randomUUID } from 'crypto'

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: Transaction[] = []

  async findById(id: string) {
    const transaction = this.items.find((item) => item.id === id)

    if (!transaction) {
      return null
    }

    return transaction
  }

  async findManyByAccountNumber(accountNumber: number, page: number) {
    return this.items
      .filter((item) => item.accountNumber === accountNumber)
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.TransactionUncheckedCreateInput) {
    const transaction = {
      id: randomUUID(),
      amount: data.amount ?? 0.0,
      transactionType: data.transactionType,
      accountNumber: data.accountNumber,
      createdAt: new Date(),
    }

    this.items.push(transaction)

    return transaction
  }

  async delete(id: string) {
    const transactionIndex = this.items.findIndex((item) => item.id === id)

    const [deletedTransaction] = this.items.splice(transactionIndex, 1)

    return deletedTransaction
  }
}
