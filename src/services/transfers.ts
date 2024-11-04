import { TransactionType, Transfer } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { TransfersRepository } from '../repositories/transfers-repository'
import { AccountsRepository } from '../repositories/accounts-repository'
import { TransactionsRepository } from '../repositories/transactions-repository'

interface CreateTransfersServiceRequest {
  fromNumber: number
  toNumber: number
  amount: number
}

interface CreateTransfersServiceResponse {
  transfer: Transfer
}

interface DeleteTransfersServiceRequest {
  transferId: string
}

export class TransfersService {
  constructor(
    private transfersRepository: TransfersRepository,
    private accountsRepository: AccountsRepository,
    private transactionsRepository: TransactionsRepository,
  ) {}

  async create({
    fromNumber,
    toNumber,
    amount,
  }: CreateTransfersServiceRequest): Promise<CreateTransfersServiceResponse> {
    const fromAccount = await this.accountsRepository.findByNumber(fromNumber)

    if (!fromAccount) {
      throw new ResourceNotFoundError()
    }

    const toAccount = await this.accountsRepository.findByNumber(toNumber)

    if (!toAccount) {
      throw new ResourceNotFoundError()
    }

    const transactionFrom = await this.transactionsRepository.create({
      amount,
      transactionType: TransactionType.EXPENSE,
      accountNumber: fromNumber,
    })

    const transactionTo = await this.transactionsRepository.create({
      amount,
      transactionType: TransactionType.INCOME,
      accountNumber: toNumber,
    })

    const transfer = await this.transfersRepository.create({
      fromId: transactionFrom.id,
      toId: transactionTo.id,
    })

    return {
      transfer,
    }
  }

  async delete({ transferId }: DeleteTransfersServiceRequest) {
    const transfer = await this.transfersRepository.findById(transferId)

    if (!transfer) {
      throw new ResourceNotFoundError()
    }

    const deleted_transfer = await this.transfersRepository.delete(transfer.id)

    return {
      deleted_transfer,
    }
  }
}
