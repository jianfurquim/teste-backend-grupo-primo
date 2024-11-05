export const schemaDeleteAccount = {
  description: 'Delete an account by ID',
  tags: ['Accounts'],
  querystring: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'The ID of the account to delete' },
    },
    required: ['id'],
  },
  response: {
    200: {
      description: 'Account deleted successfully',
      type: 'object',
      properties: {
        message: { type: 'string' },
        issues: {
          type: 'object',
          properties: {
            account: { type: 'string' }, // Nome da conta
            id: { type: 'string' }, // ID da conta
            number: { type: 'number' }, // Número da conta
          },
        },
      },
    },
    404: {
      description: 'Resource not found',
      type: 'object',
      properties: {
        message: { type: 'string' },
        issues: { type: 'object' },
      },
    },
    500: {
      description: 'Internal server error',
      type: 'object',
      properties: {
        message: { type: 'string' },
        issues: { type: 'object' },
      },
    },
  },
}
