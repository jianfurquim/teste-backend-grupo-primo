import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { UsersService } from '../users'

export function makeUsersService() {
  const usersRepository = new PrismaUsersRepository()
  const usersService = new UsersService(usersRepository)

  return usersService
}
