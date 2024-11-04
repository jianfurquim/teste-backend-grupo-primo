import { Transaction, TransactionType } from '@prisma/client'
import { AccountsRepository } from '../repositories/accounts-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InvalidBalanceValueError } from './errors/invalid-balance-value-error'
import { TransactionsRepository } from '../repositories/transactions-repository'

interface CreateTransactionsServiceRequest {
  amount: number
  transactionType: TransactionType
  accountNumber: number
}

interface CreateTransactionsServiceResponse {
  transaction: Transaction
}

export class TransactionsService {
  constructor(
    private accountsRepository: AccountsRepository,
    private transactionRepository: TransactionsRepository,
  ) {}

  async create({
    amount,
    transactionType,
    accountNumber,
  }: CreateTransactionsServiceRequest): Promise<CreateTransactionsServiceResponse> {
    const account = await this.accountsRepository.findByNumber(accountNumber)

    if (!account) {
      throw new ResourceNotFoundError()
    }

    if (amount < 0) {
      throw new InvalidBalanceValueError()
    }

    const transaction = await this.transactionRepository.create({
      amount,
      transactionType,
      accountNumber,
    })

    return {
      transaction,
    }
  }
}
