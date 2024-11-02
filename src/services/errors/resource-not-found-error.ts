export class ResourceNotFoundError extends Error {
  constructor() {
    super('Data not found or not exists.')
  }
}
