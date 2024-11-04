import { prisma } from '../../lib/prisma'
import { Prisma } from '@prisma/client'
import { TransactionsRepository } from '../transactions-repository'

export class PrismaTransactionsRepository implements TransactionsRepository {
  async findById(id: string) {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id,
      },
    })

    return transaction
  }

  async findManyByAccountNumber(accountNumber: number, page: number) {
    const transactions = await prisma.transaction.findMany({
      where: {
        accountNumber,
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return transactions
  }

  async create(data: Prisma.TransactionUncheckedCreateInput) {
    const transaction = await prisma.transaction.create({
      data,
    })

    return transaction
  }

  async delete(id: string) {
    const transaction = await prisma.transaction.delete({
      where: {
        id,
      },
    })

    return transaction
  }
}
