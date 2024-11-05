export const schemaRegister = {
  description: 'Register a new user',
  tags: ['Users'],
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'The name of the user' },
      email: {
        type: 'string',
        format: 'email',
        description: 'The email of the user',
      },
      password: { type: 'string', description: 'The password of the user' },
    },
    required: ['name', 'email', 'password'],
  },
  response: {
    202: {
      description: 'User created successfully',
      type: 'object',
      properties: {
        message: { type: 'string' },
        issues: {
          type: 'object',
          properties: {
            user: {
              type: 'string',
              description: 'The name of the created user',
            },
            token: {
              type: 'string',
              description: 'JWT token for the registered user',
            },
          },
        },
      },
    },
    404: {
      description: 'User already exists',
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
