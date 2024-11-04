import { Transfer, Prisma } from '@prisma/client'

export interface TransfersRepository {
  findById(id: string): Promise<Transfer | null>
  create(data: Prisma.TransferUncheckedCreateInput): Promise<Transfer>
  delete(id: string): Promise<Transfer | null>
}
