import { PrismaAccountsRepository } from '../../repositories/prisma/prisma-accounts-repository'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { AccountsService } from '../accounts'

export function makeAccountsService() {
  const accountsRepository = new PrismaAccountsRepository()
  const usersRepository = new PrismaUsersRepository()
  const accountsService = new AccountsService(
    accountsRepository,
    usersRepository,
  )

  return accountsService
}
