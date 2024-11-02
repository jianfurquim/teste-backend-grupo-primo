import { Account } from '@prisma/client'
import { AccountsRepository } from '../repositories/accounts-repository'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InvalidBalanceValueError } from './errors/invalid-balance-value-error'

interface CreateAccountsServiceRequest {
  name: string
  balance: number
  userId: string
}

interface CreateAccountsServiceResponse {
  account: Account
}

interface DeleteAccountsServiceRequest {
  accountId: string
}

export class AccountsService {
  constructor(
    private accountsRepository: AccountsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async create({
    name,
    balance,
    userId,
  }: CreateAccountsServiceRequest): Promise<CreateAccountsServiceResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    if (balance < 0) {
      throw new InvalidBalanceValueError()
    }

    const account = await this.accountsRepository.create({
      name,
      balance,
      userId,
    })

    return {
      account,
    }
  }

  async delete({ accountId }: DeleteAccountsServiceRequest) {
    const account = await this.accountsRepository.findById(accountId)

    if (!account) {
      throw new ResourceNotFoundError()
    }

    const deleted_account = await this.accountsRepository.delete(account.id)

    return {
      deleted_account,
    }
  }
}
