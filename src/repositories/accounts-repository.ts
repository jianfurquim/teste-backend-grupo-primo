import { Account, Prisma } from '@prisma/client'

export interface AccountsRepository {
  findById(id: string): Promise<Account | null>
  findByNumber(number: number): Promise<Account | null>
  findManyByUserId(userId: string, page: number): Promise<Account[]>
  findManyByUserIdNoPaginate(userId: string): Promise<Account[]>
  create(data: Prisma.AccountUncheckedCreateInput): Promise<Account>
  delete(id: string): Promise<Account | null>
}
