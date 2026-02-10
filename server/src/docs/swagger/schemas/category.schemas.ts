export const categorySchemas = {
  CategoryResponse: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'cuid' },
      title: { type: 'string' },
      urlCode: { $ref: '#/components/schemas/CategoryUrlCode' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'title', 'urlCode', 'createdAt', 'updatedAt'],
  },
  CreateCategoryRequest: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 2, maxLength: 100 },
      urlCode: { $ref: '#/components/schemas/CategoryUrlCode' },
    },
    required: ['title', 'urlCode'],
  },
  UpdateCategoryRequest: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 2, maxLength: 100 },
      urlCode: { $ref: '#/components/schemas/CategoryUrlCode' },
    },
  },
} as const;
