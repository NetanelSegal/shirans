export const calculatorPaths = {
  '/api/calculator/leads': {
    post: {
      tags: ['Calculator'],
      summary: 'Submit a calculator lead',
      description:
        'Public endpoint. Submits calculator form data and estimate. Rate limited (10 req/15 min per IP).',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/SubmitCalculatorLeadRequest' },
          },
        },
      },
      responses: {
        '201': {
          description: 'Lead submitted successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CalculatorLeadResponse' },
            },
          },
        },
        '400': { description: 'Validation error' },
        '429': { description: 'Too many submissions, please try again later' },
      },
    },
    get: {
      tags: ['Calculator'],
      summary: 'Get all calculator leads',
      description: 'Returns all calculator leads. Admin only.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'isRead',
          in: 'query',
          schema: { type: 'string', enum: ['true', 'false'] },
          description: 'Filter by read status',
        },
      ],
      responses: {
        '200': {
          description: 'List of calculator leads',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/CalculatorLeadResponse' },
              },
            },
          },
        },
        '401': { description: 'Not authenticated' },
        '403': { description: 'Not authorized (admin only)' },
      },
    },
  },
  '/api/calculator/leads/{id}': {
    get: {
      tags: ['Calculator'],
      summary: 'Get a calculator lead by ID',
      description: 'Returns a single calculator lead. Admin only.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'cuid' },
        },
      ],
      responses: {
        '200': {
          description: 'Calculator lead details',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CalculatorLeadResponse' },
            },
          },
        },
        '401': { description: 'Not authenticated' },
        '403': { description: 'Not authorized (admin only)' },
        '404': { description: 'Lead not found' },
      },
    },
    delete: {
      tags: ['Calculator'],
      summary: 'Delete a calculator lead',
      description: 'Deletes a calculator lead. Admin only.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'cuid' },
        },
      ],
      responses: {
        '200': { description: 'Lead deleted successfully' },
        '401': { description: 'Not authenticated' },
        '403': { description: 'Not authorized (admin only)' },
        '404': { description: 'Lead not found' },
      },
    },
  },
  '/api/calculator/leads/{id}/read': {
    patch: {
      tags: ['Calculator'],
      summary: 'Update calculator lead read status',
      description: 'Updates read status of a calculator lead. Admin only.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'cuid' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { type: 'object', properties: { isRead: { type: 'boolean' } }, required: ['isRead'] },
          },
        },
      },
      responses: {
        '200': {
          description: 'Read status updated',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CalculatorLeadResponse' },
            },
          },
        },
        '400': { description: 'Validation error' },
        '401': { description: 'Not authenticated' },
        '403': { description: 'Not authorized (admin only)' },
        '404': { description: 'Lead not found' },
      },
    },
  },
  '/api/calculator/config': {
    get: {
      tags: ['Calculator'],
      summary: 'Get calculator config',
      description:
        'Public endpoint. Returns calculator rates/config for the landing page and admin calculator.',
      responses: {
        '200': {
          description: 'Calculator config',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CalculatorConfig' },
            },
          },
        },
      },
    },
    put: {
      tags: ['Calculator'],
      summary: 'Update calculator config',
      description: 'Updates calculator rates/config. Admin only.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CalculatorConfig' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Config updated',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CalculatorConfig' },
            },
          },
        },
        '400': { description: 'Validation error' },
        '401': { description: 'Not authenticated' },
        '403': { description: 'Not authorized (admin only)' },
      },
    },
  },
} as const;
