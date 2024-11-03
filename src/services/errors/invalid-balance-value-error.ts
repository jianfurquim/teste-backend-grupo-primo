export class InvalidBalanceValueError extends Error {
  constructor() {
    super('Unable to create account with negative balance.')
  }
}
