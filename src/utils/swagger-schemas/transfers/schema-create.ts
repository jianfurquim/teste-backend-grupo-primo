export const schemaCreateTransfer = {
  description: 'Create a new transfer between accounts',
  tags: ['Transfers'],
  body: {
    type: 'object',
    properties: {
      fromNumber: {
        type: 'number',
        description: 'The account number to transfer from',
      },
      toNumber: {
        type: 'number',
        description: 'The account number to transfer to',
      },
      amount: { type: 'number', description: 'The amount to transfer' },
    },
    required: ['fromNumber', 'toNumber', 'amount'],
  },
  response: {
    202: {
      description: 'Transfer created successfully',
      type: 'object',
      properties: {
        message: { type: 'string' },
        issues: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            fromId: { type: 'string' },
            toId: { type: 'string' },
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
