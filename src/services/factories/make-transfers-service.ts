import { PrismaAccountsRepository } from '../../repositories/prisma/prisma-accounts-repository'
import { PrismaTransactionsRepository } from '../../repositories/prisma/prisma-transactions-repository'
import { PrismaTransfersRepository } from '../../repositories/prisma/prisma-transfers-repository'
import { TransfersService } from '../transfers'

export function makeTransfersService() {
  const tranfersRepository = new PrismaTransfersRepository()
  const accountsRepository = new PrismaAccountsRepository()
  const transactionsRepository = new PrismaTransactionsRepository()
  const transfersService = new TransfersService(
    tranfersRepository,
    accountsRepository,
    transactionsRepository,
  )

  return transfersService
}
