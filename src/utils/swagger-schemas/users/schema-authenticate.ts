export const schemaAuthenticate = {
  description: 'Authenticate a user',
  tags: ['Users'],
  body: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'The email of the user',
      },
      password: { type: 'string', description: 'The password of the user' },
    },
    required: ['email', 'password'],
  },
  response: {
    202: {
      description: 'User authenticated successfully',
      type: 'object',
      properties: {
        message: { type: 'string' },
        issues: {
          type: 'object',
          properties: {
            user: {
              type: 'string',
              description: 'The email of the authenticated user',
            },
            token: {
              type: 'string',
              description: 'JWT token for the authenticated user',
            },
          },
        },
      },
    },
    400: {
      description: 'Invalid credentials',
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
