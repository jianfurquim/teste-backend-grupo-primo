export const schemaExpenseDelete = {
  description: 'Delete an existing expense transaction',
  tags: ['Transactions'],
  querystring: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the transaction to delete',
      },
    },
    required: ['id'],
  },
  response: {
    202: {
      description: 'Expense deleted successfully',
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
