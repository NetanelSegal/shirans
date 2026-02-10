export const commonSchemas = {
  ErrorResponse: {
    type: 'object',
    properties: {
      error: { type: 'string', example: 'HttpError' },
      message: { type: 'string', example: 'Resource not found' },
      stack: { type: 'string', description: 'Stack trace (development only)' },
      validationErrors: {
        type: 'string',
        description: 'Validation error details (development only)',
      },
    },
    required: ['error', 'message'],
  },
  MessageResponse: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Operation completed successfully' },
    },
    required: ['message'],
  },
  UserRole: {
    type: 'string',
    enum: ['ADMIN', 'USER'],
  },
  CategoryUrlCode: {
    type: 'string',
    enum: ['privateHouses', 'apartments', 'publicSpaces'],
  },
  ResponsiveImage: {
    type: 'object',
    properties: {
      mobile: { type: 'string', format: 'uri' },
      tablet: { type: 'string', format: 'uri' },
      desktop: { type: 'string', format: 'uri' },
      fallback: { type: 'string', format: 'uri' },
    },
    required: ['desktop'],
  },
} as const;
