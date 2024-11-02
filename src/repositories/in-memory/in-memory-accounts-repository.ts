import { Prisma, Account } from '@prisma/client'
import { AccountsRepository } from '../accounts-repository'

export class InMemoryAccountsRepository implements AccountsRepository {
  public items: Account[] = []

  async findById(id: string) {
    const account = this.items.find((item) => item.id === id)

    if (!account) {
      return null
    }

    return account
  }

  async create(data: Prisma.AccountUncheckedCreateInput) {
    const account = {
      id: 'account-1',
      name: data.name ?? null,
      balance: data.balance ?? 0.0,
      userId: data.userId,
      created_at: new Date(),
    }

    this.items.push(account)

    return account
  }

  async delete(id: string) {
    const accountIndex = this.items.findIndex((item) => item.id === id)

    const [deletedAccount] = this.items.splice(accountIndex, 1)

    return deletedAccount
  }
}
