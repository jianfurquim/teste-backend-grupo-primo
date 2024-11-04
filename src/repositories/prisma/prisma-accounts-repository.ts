import { prisma } from '../../lib/prisma'
import { Prisma } from '@prisma/client'
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

  async create(data: Prisma.AccountUncheckedCreateInput) {
    const account = await prisma.account.create({
      data,
    })

    return account
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
