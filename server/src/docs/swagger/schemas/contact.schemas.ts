export const contactSchemas = {
  ContactResponse: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'cuid' },
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      phoneNumber: { type: 'string', pattern: '^[0-9]{10}$' },
      message: { type: 'string', nullable: true },
      isRead: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'name', 'email', 'phoneNumber', 'message', 'isRead', 'createdAt'],
  },
  CreateContactRequest: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 50 },
      email: { type: 'string', format: 'email' },
      phoneNumber: {
        type: 'string',
        pattern: '^[0-9]{10}$',
        example: '0501234567',
      },
      message: { type: 'string', maxLength: 2000 },
    },
    required: ['name', 'email', 'phoneNumber'],
  },
  UpdateReadStatusRequest: {
    type: 'object',
    properties: {
      isRead: { type: 'boolean' },
    },
    required: ['isRead'],
  },
} as const;
