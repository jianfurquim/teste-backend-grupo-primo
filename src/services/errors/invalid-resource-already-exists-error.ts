export class ResourceAlreadyExistsError extends Error {
  constructor() {
    super('The provided unique field value already exists.')
  }
}
