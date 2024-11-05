export const schemaGetAccountByNumber = {
  description: 'Get account details by account number',
  tags: ['Accounts'],
  querystring: {
    type: 'object',
    properties: {
      accountNumber: {
        type: 'number',
        description: 'The number of the account to retrieve',
      },
    },
    required: ['accountNumber'],
  },
  response: {
    202: {
      description: 'Account retrieved successfully',
      type: 'object',
      properties: {
        message: { type: 'string' },
        issues: {
          type: 'object',
          properties: {
            id: { type: 'string' }, // Adapte o tipo de acordo com a estrutura do seu account
            account: { type: 'string' },
            number: { type: 'number' },
            balance: { type: 'number' },
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
