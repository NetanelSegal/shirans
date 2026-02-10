export const authSchemas = {
  RegisterRequest: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        maxLength: 255,
        example: 'user@example.com',
      },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 100,
        description:
          'Must contain uppercase, lowercase, number, and special character',
        example: 'MyP@ssw0rd',
      },
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        example: 'John Doe',
      },
    },
    required: ['email', 'password', 'name'],
  },
  LoginRequest: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'user@example.com',
      },
      password: {
        type: 'string',
        minLength: 8,
        example: 'MyP@ssw0rd',
      },
    },
    required: ['email', 'password'],
  },
  UserResponse: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'cuid' },
      email: { type: 'string', format: 'email' },
      name: { type: 'string' },
      role: { $ref: '#/components/schemas/UserRole' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
  },
  AuthResponse: {
    type: 'object',
    properties: {
      user: { $ref: '#/components/schemas/UserResponse' },
      accessToken: { type: 'string' },
    },
    required: ['user', 'accessToken'],
  },
  RefreshResponse: {
    type: 'object',
    properties: {
      accessToken: { type: 'string' },
    },
    required: ['accessToken'],
  },
} as const;
