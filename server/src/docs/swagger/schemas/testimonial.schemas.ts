export const testimonialSchemas = {
  TestimonialResponse: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'cuid' },
      name: { type: 'string' },
      message: { type: 'string' },
      isPublished: { type: 'boolean' },
      order: { type: 'integer' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: [
      'id',
      'name',
      'message',
      'isPublished',
      'order',
      'createdAt',
      'updatedAt',
    ],
  },
  CreateTestimonialRequest: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 100 },
      message: { type: 'string', minLength: 10, maxLength: 2000 },
      isPublished: { type: 'boolean', default: false },
      order: { type: 'integer', minimum: 0, default: 0 },
    },
    required: ['name', 'message'],
  },
  UpdateTestimonialRequest: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 100 },
      message: { type: 'string', minLength: 10, maxLength: 2000 },
      isPublished: { type: 'boolean' },
      order: { type: 'integer', minimum: 0 },
    },
  },
  UpdateOrderRequest: {
    type: 'object',
    properties: {
      order: { type: 'integer', minimum: 0 },
    },
    required: ['order'],
  },
} as const;
