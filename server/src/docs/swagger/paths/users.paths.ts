export const usersPaths = {
  '/api/users': {
    get: {
      tags: ['Users'],
      summary: 'Get all users',
      description:
        'Returns all registered users. Requires admin authentication. Used by admin dashboard.',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'List of users',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/UserResponse' },
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
          description: 'Forbidden - admin role required',
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
