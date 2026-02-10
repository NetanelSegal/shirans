export const projectsPaths = {
  '/api/projects': {
    get: {
      tags: ['Projects'],
      summary: 'Get all projects',
      description: 'Returns all projects with optional filters for category, favourite, and completion status.',
      parameters: [
        {
          name: 'category',
          in: 'query',
          schema: { type: 'string', format: 'cuid' },
          description: 'Filter by category ID',
        },
        {
          name: 'favourite',
          in: 'query',
          schema: { type: 'string', enum: ['true', 'false'] },
          description: 'Filter by favourite status',
        },
        {
          name: 'isCompleted',
          in: 'query',
          schema: { type: 'string', enum: ['true', 'false'] },
          description: 'Filter by completion status',
        },
      ],
      responses: {
        '200': {
          description: 'List of projects',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/ProjectResponse' },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ['Projects'],
      summary: 'Create a new project',
      description: 'Creates a new project. Requires admin authentication.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateProjectRequest' },
          },
        },
      },
      responses: {
        '201': {
          description: 'Project created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProjectResponse' },
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
    put: {
      tags: ['Projects'],
      summary: 'Update a project',
      description: 'Updates an existing project. Requires admin authentication. Project ID is in the request body.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateProjectRequest' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Project updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProjectResponse' },
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
          description: 'Project not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
    delete: {
      tags: ['Projects'],
      summary: 'Delete a project',
      description: 'Deletes a project and all its images. Requires admin authentication. Project ID is in the request body.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/DeleteProjectRequest' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Project deleted successfully',
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
          description: 'Project not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },
  '/api/projects/favourites': {
    get: {
      tags: ['Projects'],
      summary: 'Get favourite projects',
      description: 'Returns all projects marked as favourite.',
      responses: {
        '200': {
          description: 'List of favourite projects',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/ProjectResponse' },
              },
            },
          },
        },
      },
    },
  },
  '/api/projects/single': {
    get: {
      tags: ['Projects'],
      summary: 'Get a single project',
      description: 'Returns a single project by ID passed as a query parameter.',
      parameters: [
        {
          name: 'id',
          in: 'query',
          required: true,
          schema: { type: 'string', format: 'cuid' },
          description: 'Project ID',
        },
      ],
      responses: {
        '200': {
          description: 'Project details',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProjectResponse' },
            },
          },
        },
        '400': {
          description: 'Invalid project ID',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        '404': {
          description: 'Project not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },
  '/api/projects/uploadImgs': {
    post: {
      tags: ['Projects'],
      summary: 'Upload images to a project',
      description: 'Adds images to an existing project. Requires admin authentication.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UploadImagesRequest' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Images uploaded successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProjectResponse' },
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
          description: 'Project not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },
  '/api/projects/deleteMainImage': {
    delete: {
      tags: ['Projects'],
      summary: 'Delete main image from a project',
      description: 'Removes the main image from a project. Requires admin authentication.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/DeleteMainImageRequest' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Main image deleted successfully',
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
          description: 'Project not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },
  '/api/projects/deleteImages': {
    delete: {
      tags: ['Projects'],
      summary: 'Delete specific images from a project',
      description: 'Removes specific images from a project by image IDs. Requires admin authentication.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/DeleteImagesRequest' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Images deleted successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MessageResponse' },
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
          description: 'Project not found',
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
