export const schemaListAccounts = {
  description: 'List accounts for a user',
  tags: ['Accounts'],
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'number', description: 'The page number for pagination' },
    },
    required: ['page'],
  },
  response: {
    202: {
      description: 'Accounts listed successfully',
      type: 'object',
      properties: {
        message: { type: 'string' },
        issues: {
          type: 'object',
          properties: {
            accounts: { type: 'array', items: { type: 'object' } }, // Adapte o tipo de acordo com a estrutura dos accounts
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
