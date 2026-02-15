export const contactPaths = {
  '/api/contact': {
    post: {
      tags: ['Contact'],
      summary: 'Submit a contact form',
      description: 'Submits a new contact form entry. This is a public endpoint.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateContactRequest' },
          },
        },
      },
      responses: {
        '201': {
          description: 'Contact form submitted successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ContactResponse' },
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
      },
    },
    get: {
      tags: ['Contact'],
      summary: 'Get all contact submissions',
      description:
        'Returns all contact form submissions with optional read status filter. Requires admin authentication.',
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
          description: 'List of contact submissions',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/ContactResponse' },
              },
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
      },
    },
  },
  '/api/contact/{id}': {
    get: {
      tags: ['Contact'],
      summary: 'Get a contact submission by ID',
      description:
        'Returns a single contact submission. Requires admin authentication.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'cuid' },
          description: 'Contact submission ID',
        },
      ],
      responses: {
        '200': {
          description: 'Contact submission details',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ContactResponse' },
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
          description: 'Submission not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
    delete: {
      tags: ['Contact'],
      summary: 'Delete a contact submission',
      description:
        'Deletes a contact submission by ID. Requires admin authentication.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'cuid' },
          description: 'Contact submission ID',
        },
      ],
      responses: {
        '200': {
          description: 'Submission deleted successfully',
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
          description: 'Submission not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },
  '/api/contact/{id}/read': {
    patch: {
      tags: ['Contact'],
      summary: 'Update read status',
      description:
        'Updates the read status of a contact submission. Requires admin authentication.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'cuid' },
          description: 'Contact submission ID',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateReadStatusRequest' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Read status updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ContactResponse' },
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
          description: 'Submission not found',
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
