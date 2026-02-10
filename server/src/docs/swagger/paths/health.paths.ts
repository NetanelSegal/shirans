export const healthPaths = {
  '/api/health': {
    get: {
      tags: ['Health'],
      summary: 'Health check',
      description: 'Returns the API health status and current timestamp.',
      responses: {
        '200': {
          description: 'API is healthy',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'ok' },
                  timestamp: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-01-01T00:00:00.000Z',
                  },
                },
                required: ['status', 'timestamp'],
              },
            },
          },
        },
      },
    },
  },
} as const;
