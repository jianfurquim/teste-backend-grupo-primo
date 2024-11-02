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
}
