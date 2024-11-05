export const schemaExpenseCreate = {
  description: 'Create a new expense transaction',
  tags: ['Transactions'],
  body: {
    type: 'object',
    properties: {
      amount: { type: 'number', description: 'The amount of the expense' },
      accountNumber: {
        type: 'number',
        description: 'The account number related to the transaction',
      },
    },
    required: ['amount', 'accountNumber'],
  },
  response: {
    202: {
      description: 'Expense created successfully',
      type: 'object',
      properties: {
        message: { type: 'string' },
        issues: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            accountNumber: { type: 'number' },
            amount: { type: 'number' },
            transactionType: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' }, // Formato da data
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
      description: 'Invalid balance value',
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
