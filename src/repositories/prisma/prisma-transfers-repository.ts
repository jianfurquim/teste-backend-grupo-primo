import { prisma } from '../../lib/prisma'
import { Prisma } from '@prisma/client'
import { TransfersRepository } from '../transfers-repository'

export class PrismaTransfersRepository implements TransfersRepository {
  async findById(id: string) {
    const transfer = await prisma.transfer.findUnique({
      where: {
        id,
      },
    })

    return transfer
  }

  async create(data: Prisma.TransferUncheckedCreateInput) {
    const transfer = await prisma.transfer.create({
      data,
    })

    return transfer
  }

  async delete(id: string) {
    const account = await prisma.transfer.delete({
      where: {
        id,
      },
    })

    return account
  }
}
