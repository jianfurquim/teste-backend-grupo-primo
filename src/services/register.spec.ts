import { compare } from 'bcryptjs'
import { expect, describe, it } from 'vitest'
import { RegisterService } from './register'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists.error'

describe('Register Service', () => {
  it('should be able to register', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(inMemoryUsersRepository)

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(inMemoryUsersRepository)

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.password)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(inMemoryUsersRepository)

    const email = 'johndoe@gmail.com'

    await registerService.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      registerService.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
