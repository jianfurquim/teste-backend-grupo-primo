import { Transaction, TransactionType } from '@prisma/client'
import { AccountsRepository } from '../repositories/accounts-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InvalidBalanceValueError } from './errors/invalid-balance-value-error'
import { TransactionsRepository } from '../repositories/transactions-repository'
import { UsersRepository } from '../repositories/users-repository'

interface CreateTransactionsServiceRequest {
  amount: number
  transactionType: TransactionType
  accountNumber: number
}

interface CreateTransactionsServiceResponse {
  transaction: Transaction
}

interface ListTransactionsServiceRequest {
  accountNumber: number
  page: number
}

interface ListTransactionsServiceResponse {
  transactions: Transaction[]
}

interface ListByUserIdTransactionsServiceRequest {
  userId: string
  page: number
}

interface ListByUserIdTransactionsServiceResponse {
  transactions: Transaction[]
}

interface DeleteTransactionsServiceRequest {
  transactionId: string
}

export class TransactionsService {
  constructor(
    private usersRepository: UsersRepository,
    private accountsRepository: AccountsRepository,
    private transactionRepository: TransactionsRepository,
  ) {}

  async list({
    accountNumber,
    page,
  }: ListTransactionsServiceRequest): Promise<ListTransactionsServiceResponse> {
    const account = await this.accountsRepository.findByNumber(accountNumber)

    if (!account) {
      throw new ResourceNotFoundError()
    }

    const transactions =
      await this.transactionRepository.findManyByAccountNumber(
        accountNumber,
        page,
      )

    return {
      transactions,
    }
  }

  async listByUserId({
    userId,
    page,
  }: ListByUserIdTransactionsServiceRequest): Promise<ListByUserIdTransactionsServiceResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const accountNumbers = (
      await this.accountsRepository.findManyByUserIdNoPaginate(userId)
    ).map((account) => account.number)

    const transactions = await this.transactionRepository.findManyByUserId(
      userId,
      accountNumbers,
      page,
    )

    return {
      transactions,
    }
  }

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

    await this.accountsRepository.changeBalance(
      account.number,
      amount,
      transactionType,
    )

    return {
      transaction,
    }
  }

  async delete({ transactionId }: DeleteTransactionsServiceRequest) {
    const transaction = await this.transactionRepository.findById(transactionId)

    if (!transaction) {
      throw new ResourceNotFoundError()
    }

    const adjustmentAmount =
      transaction.transactionType === TransactionType.EXPENSE
        ? transaction.amount // Adiciona de volta se for uma despesa
        : -transaction.amount // Subtrai se for uma receita

    await this.accountsRepository.changeBalance(
      transaction.accountNumber,
      adjustmentAmount,
      transaction.transactionType,
    )

    const deleted_transaction = await this.transactionRepository.delete(
      transaction.id,
    )

    return {
      deleted_transaction,
    }
  }
}
