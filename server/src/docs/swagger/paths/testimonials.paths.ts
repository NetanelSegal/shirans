export const testimonialsPaths = {
  '/api/testimonials': {
    get: {
      tags: ['Testimonials'],
      summary: 'Get all testimonials',
      description:
        'Returns all testimonials with optional filter by published status.',
      parameters: [
        {
          name: 'isPublished',
          in: 'query',
          schema: { type: 'string', enum: ['true', 'false'] },
          description: 'Filter by published status',
        },
      ],
      responses: {
        '200': {
          description: 'List of testimonials',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/TestimonialResponse',
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ['Testimonials'],
      summary: 'Create a testimonial',
      description:
        'Creates a new testimonial. Requires admin authentication.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateTestimonialRequest',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Testimonial created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TestimonialResponse',
              },
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
      },
    },
  },
  '/api/testimonials/bulk': {
    patch: {
      tags: ['Testimonials'],
      summary: 'Bulk update testimonials',
      description:
        'Updates isPublished for multiple testimonials. Requires admin authentication.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                ids: { type: 'array', items: { type: 'string', format: 'cuid' } },
                isPublished: { type: 'boolean' },
              },
              required: ['ids', 'isPublished'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Bulk update successful',
          content: {
            'application/json': {
              schema: { type: 'object', properties: { count: { type: 'number' } } },
            },
          },
        },
        '400': { description: 'Validation error' },
        '401': { description: 'Not authenticated' },
        '403': { description: 'Not authorized (admin only)' },
      },
    },
    delete: {
      tags: ['Testimonials'],
      summary: 'Bulk delete testimonials',
      description:
        'Deletes multiple testimonials. Requires admin authentication.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                ids: { type: 'array', items: { type: 'string', format: 'cuid' } },
              },
              required: ['ids'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Bulk delete successful',
          content: {
            'application/json': {
              schema: { type: 'object', properties: { count: { type: 'number' } } },
            },
          },
        },
        '400': { description: 'Validation error' },
        '401': { description: 'Not authenticated' },
        '403': { description: 'Not authorized (admin only)' },
      },
    },
  },
  '/api/testimonials/published': {
    get: {
      tags: ['Testimonials'],
      summary: 'Get published testimonials',
      description: 'Returns only published testimonials.',
      responses: {
        '200': {
          description: 'List of published testimonials',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/TestimonialResponse',
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/testimonials/{id}': {
    get: {
      tags: ['Testimonials'],
      summary: 'Get a testimonial by ID',
      description:
        'Returns a single testimonial. Requires admin authentication.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'cuid' },
          description: 'Testimonial ID',
        },
      ],
      responses: {
        '200': {
          description: 'Testimonial details',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TestimonialResponse',
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
        '404': {
          description: 'Testimonial not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
    put: {
      tags: ['Testimonials'],
      summary: 'Update a testimonial',
      description:
        'Updates an existing testimonial. Requires admin authentication.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'cuid' },
          description: 'Testimonial ID',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateTestimonialRequest',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Testimonial updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TestimonialResponse',
              },
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
          description: 'Testimonial not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
    delete: {
      tags: ['Testimonials'],
      summary: 'Delete a testimonial',
      description:
        'Deletes a testimonial by ID. Requires admin authentication.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'cuid' },
          description: 'Testimonial ID',
        },
      ],
      responses: {
        '200': {
          description: 'Testimonial deleted successfully',
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
          description: 'Testimonial not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },
  '/api/testimonials/{id}/order': {
    patch: {
      tags: ['Testimonials'],
      summary: 'Update testimonial order',
      description:
        'Updates the display order of a testimonial. Requires admin authentication.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'cuid' },
          description: 'Testimonial ID',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateOrderRequest' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Order updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TestimonialResponse',
              },
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
          description: 'Testimonial not found',
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
