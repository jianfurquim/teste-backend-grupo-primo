export const schemaDeleteTransfer = {
  description: 'Delete a transfer by ID',
  tags: ['Transfers'],
  querystring: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'The ID of the transfer to delete' },
    },
    required: ['id'],
  },
  response: {
    202: {
      description: 'Transfer deleted successfully',
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
