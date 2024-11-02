import { Account, Prisma } from '@prisma/client'

export interface AccountsRepository {
  findById(id: string): Promise<Account | null>
  create(data: Prisma.AccountUncheckedCreateInput): Promise<Account>
  delete(id: string): Promise<Account | null>
  //   update(data: Prisma.AccountCreateInput): Promise<Account>
}
