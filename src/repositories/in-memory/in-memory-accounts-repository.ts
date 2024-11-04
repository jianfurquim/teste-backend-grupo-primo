import { Prisma, Account, TransactionType } from '@prisma/client'
import { AccountsRepository } from '../accounts-repository'
import { randomUUID } from 'crypto'

export class InMemoryAccountsRepository implements AccountsRepository {
  public items: Account[] = []

  async findById(id: string) {
    const account = this.items.find((item) => item.id === id)

    if (!account) {
      return null
    }

    return account
  }

  async findByNumber(number: number) {
    const account = this.items.find((item) => item.number === number)

    if (!account) {
      return null
    }

    return account
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((item) => item.userId === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async findManyByUserIdNoPaginate(userId: string) {
    return this.items.filter((item) => item.userId === userId)
  }

  async changeBalance(
    accountId: string,
    amount: number,
    type: TransactionType,
  ): Promise<Account> {
    const account = await this.findById(accountId)

    if (!account) {
      throw new Error('Account not found')
    }

    const newBalance =
      type === TransactionType.INCOME
        ? account.balance + amount
        : account.balance - amount

    // Atualiza o saldo da conta
    account.balance = newBalance

    return account
  }

  async create(data: Prisma.AccountUncheckedCreateInput) {
    const account = {
      id: randomUUID(),
      name: data.name ?? null,
      number: data.number,
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
