import { Account } from '@prisma/client'
import { AccountsRepository } from '../repositories/accounts-repository'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InvalidBalanceValueError } from './errors/invalid-balance-value-error'

interface CreateAccountsServiceRequest {
  id: string
  name: string
  balance: number
  userId: string
}

interface CreateAccountsServiceResponse {
  account: Account
}

interface ListAccountsServiceRequest {
  userId: string
  page: number
}

interface ListAccountsServiceResponse {
  accounts: Account[]
}

interface DeleteAccountsServiceRequest {
  accountId: string
}

export class AccountsService {
  constructor(
    private accountsRepository: AccountsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async list({
    userId,
    page,
  }: ListAccountsServiceRequest): Promise<ListAccountsServiceResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const accounts = await this.accountsRepository.findManyByUserId(
      userId,
      page,
    )

    return {
      accounts,
    }
  }

  async create({
    id,
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
      id,
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
