import { Prisma, Transfer } from '@prisma/client'
import { randomUUID } from 'crypto'
import { TransfersRepository } from '../transfers-repository'

export class InMemoryTransfersRepository implements TransfersRepository {
  public items: Transfer[] = []

  async findById(id: string) {
    const transfer = this.items.find((item) => item.id === id)

    if (!transfer) {
      return null
    }

    return transfer
  }

  async create(data: Prisma.TransferUncheckedCreateInput) {
    const Transfer = {
      id: randomUUID(),
      fromId: data.fromId,
      toId: data.toId,
    }

    this.items.push(Transfer)

    return Transfer
  }

  async delete(id: string) {
    const transferIndex = this.items.findIndex((item) => item.id === id)

    const [deletedTransfer] = this.items.splice(transferIndex, 1)

    return deletedTransfer
  }
}
