import { Transaction, Prisma } from '@prisma/client'
import { TransactionsRepository } from '../transactions-repository'
import { randomUUID } from 'crypto'

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: Transaction[] = []

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
}
