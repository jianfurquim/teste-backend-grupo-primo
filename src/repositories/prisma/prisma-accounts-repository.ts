import { prisma } from '../../lib/prisma'
import { Prisma, TransactionType } from '@prisma/client'
import { AccountsRepository } from '../accounts-repository'

export class PrismaAccountsRepository implements AccountsRepository {
  async findById(id: string) {
    const account = await prisma.account.findUnique({
      where: {
        id,
      },
    })

    return account
  }

  async findByNumber(number: number) {
    const account = await prisma.account.findUnique({
      where: {
        number,
      },
    })

    return account
  }

  async findManyByUserId(userId: string, page: number) {
    const accounts = await prisma.account.findMany({
      where: {
        userId,
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return accounts
  }

  async findManyByUserIdNoPaginate(userId: string) {
    const accounts = await prisma.account.findMany({
      where: {
        userId,
      },
    })

    return accounts
  }

  async create(data: Prisma.AccountUncheckedCreateInput) {
    const account = await prisma.account.create({
      data,
    })

    return account
  }

  async changeBalance(
    accountId: string,
    amount: number,
    type: TransactionType,
  ) {
    return await prisma.$transaction(async (tx) => {
      const account = await tx.account.findUnique({
        where: { id: accountId },
      })

      if (!account) {
        throw new Error('Account not found')
      }

      const newBalance =
        type === TransactionType.INCOME
          ? account.balance + amount
          : account.balance - amount

      const updatedAccount = await tx.account.update({
        where: { id: accountId },
        data: { balance: newBalance },
      })

      return updatedAccount
    })
  }

  async delete(id: string) {
    const account = await prisma.account.delete({
      where: {
        id,
      },
    })

    return account
  }
}
