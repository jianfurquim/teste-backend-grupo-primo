export const schemaCreateAccount = {
  description: 'Create a new account',
  tags: ['Accounts'],
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'The name of the account holder' },
      number: { type: 'number', description: 'The account number' },
      balance: {
        type: 'number',
        description: 'The initial balance of the account',
      },
    },
    required: ['name', 'number', 'balance'],
  },
  response: {
    202: {
      description: 'Account created successfully',
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
    409: {
      description: 'Conflict: resource already exists or invalid balance value',
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
