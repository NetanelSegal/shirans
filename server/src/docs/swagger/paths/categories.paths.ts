export const categoriesPaths = {
  '/api/categories': {
    get: {
      tags: ['Categories'],
      summary: 'Get all categories',
      description: 'Returns all project categories.',
      responses: {
        '200': {
          description: 'List of categories',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/CategoryResponse' },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ['Categories'],
      summary: 'Create a new category',
      description: 'Creates a new project category. Requires admin authentication.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateCategoryRequest' },
          },
        },
      },
      responses: {
        '201': {
          description: 'Category created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CategoryResponse' },
            },
          },
        },
        '400': {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        '401': {
          description: 'Not authenticated',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        '403': {
          description: 'Not authorized (admin only)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        '409': {
          description: 'Category with this urlCode already exists',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },
  '/api/categories/{id}': {
    get: {
      tags: ['Categories'],
      summary: 'Get a category by ID',
      description: 'Returns a single category by its ID.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'cuid' },
          description: 'Category ID',
        },
      ],
      responses: {
        '200': {
          description: 'Category details',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CategoryResponse' },
            },
          },
        },
        '404': {
          description: 'Category not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
    put: {
      tags: ['Categories'],
      summary: 'Update a category',
      description: 'Updates an existing category. Requires admin authentication.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'cuid' },
          description: 'Category ID',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateCategoryRequest' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Category updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CategoryResponse' },
            },
          },
        },
        '400': {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        '401': {
          description: 'Not authenticated',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        '403': {
          description: 'Not authorized (admin only)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        '404': {
          description: 'Category not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
    delete: {
      tags: ['Categories'],
      summary: 'Delete a category',
      description: 'Deletes a category by its ID. Requires admin authentication.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'cuid' },
          description: 'Category ID',
        },
      ],
      responses: {
        '200': {
          description: 'Category deleted successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MessageResponse' },
            },
          },
        },
        '401': {
          description: 'Not authenticated',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        '403': {
          description: 'Not authorized (admin only)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        '404': {
          description: 'Category not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },
} as const;
