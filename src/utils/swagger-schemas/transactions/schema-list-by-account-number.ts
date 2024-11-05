export const schemaListTransactionsByAccountNumber = {
  description: 'List transactions by account number',
  tags: ['Transactions'],
  querystring: {
    type: 'object',
    properties: {
      accountNumber: {
        type: 'number',
        description: 'The account number to filter transactions',
      },
      page: { type: 'number', description: 'Page number for pagination' },
    },
    required: ['accountNumber', 'page'],
  },
  response: {
    202: {
      description: 'Transactions listed successfully',
      type: 'object',
      properties: {
        message: { type: 'string' },
        issues: {
          type: 'object',
          properties: {
            transactions: { type: 'array', items: { type: 'object' } }, // Detalhes das transações
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
