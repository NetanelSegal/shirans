export const authPaths = {
  '/api/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Register a new user',
      description:
        'Creates a new user account. Returns user data and access token. A refresh token is set as an httpOnly cookie.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RegisterRequest' },
          },
        },
      },
      responses: {
        '201': {
          description: 'User registered successfully',
          headers: {
            'Set-Cookie': {
              description: 'httpOnly refresh token cookie',
              schema: { type: 'string' },
            },
          },
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthResponse' },
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
        '409': {
          description: 'Email already exists',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },
  '/api/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login user',
      description:
        'Authenticates a user with email and password. Returns user data and access token. A refresh token is set as an httpOnly cookie.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LoginRequest' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Login successful',
          headers: {
            'Set-Cookie': {
              description: 'httpOnly refresh token cookie',
              schema: { type: 'string' },
            },
          },
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthResponse' },
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
          description: 'Invalid credentials',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },
  '/api/auth/refresh': {
    post: {
      tags: ['Auth'],
      summary: 'Refresh access token',
      description:
        'Refreshes the access token using the refresh token from the httpOnly cookie. A new refresh token cookie is also set.',
      responses: {
        '200': {
          description: 'Token refreshed successfully',
          headers: {
            'Set-Cookie': {
              description: 'New httpOnly refresh token cookie',
              schema: { type: 'string' },
            },
          },
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RefreshResponse' },
            },
          },
        },
        '401': {
          description: 'Missing or invalid refresh token',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },
  '/api/auth/me': {
    get: {
      tags: ['Auth'],
      summary: 'Get current user',
      description: 'Returns the currently authenticated user profile.',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Current user data',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: { $ref: '#/components/schemas/UserResponse' },
                },
                required: ['user'],
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
      },
    },
  },
  '/api/auth/logout': {
    post: {
      tags: ['Auth'],
      summary: 'Logout user',
      description:
        'Revokes the refresh token server-side and clears the refresh token cookie. Access tokens will expire naturally.',
      responses: {
        '200': {
          description: 'Logged out successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MessageResponse' },
            },
          },
        },
      },
    },
  },
} as const;
