import { prisma } from '../../lib/prisma'
import { Prisma } from '@prisma/client'
import { TransactionsRepository } from '../transactions-repository'

export class PrismaTransactionsRepository implements TransactionsRepository {
  async create(data: Prisma.TransactionUncheckedCreateInput) {
    const transaction = await prisma.transaction.create({
      data,
    })

    return transaction
  }
}
