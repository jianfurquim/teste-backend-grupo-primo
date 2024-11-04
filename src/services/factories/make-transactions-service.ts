import { PrismaAccountsRepository } from '../../repositories/prisma/prisma-accounts-repository'
import { PrismaTransactionsRepository } from '../../repositories/prisma/prisma-transactions-repository'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { TransactionsService } from '../transactions'

export function makeTransactionsService() {
  const usersRepository = new PrismaUsersRepository()
  const accountsRepository = new PrismaAccountsRepository()
  const transactionsRepository = new PrismaTransactionsRepository()
  const transactionsService = new TransactionsService(
    usersRepository,
    accountsRepository,
    transactionsRepository,
  )

  return transactionsService
}
