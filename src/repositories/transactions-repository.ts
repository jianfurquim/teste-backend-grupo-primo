import { Prisma, Transaction } from '@prisma/client'

export interface TransactionsRepository {
  findById(id: string): Promise<Transaction | null>
  findManyByAccountNumber(
    accountNumber: number,
    page: number,
  ): Promise<Transaction[]>
  findManyByAccountNumberNoPaginate(
    accountNumber: number,
  ): Promise<Transaction[]>
  findManyByUserId(
    userId: string,
    accountNumbers: number[],
    page: number,
  ): Promise<Transaction[]>
  create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction>
  delete(id: string): Promise<Transaction | null>
}
