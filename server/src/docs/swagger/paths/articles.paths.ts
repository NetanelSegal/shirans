const notFound = {
  '404': {
    description: 'Article not found',
    content: {
      'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
    },
  },
};

const validationError = {
  '400': {
    description: 'Validation error',
    content: {
      'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
    },
  },
};

const bulkBody = {
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          ids: { type: 'array', items: { type: 'string', format: 'cuid' }, minItems: 1 },
          published: { type: 'boolean' },
        },
        required: ['ids'],
      },
    },
  },
};

export const articlesPaths = {
  '/api/articles': {
    get: {
      tags: ['Articles'],
      summary: 'List all articles',
      description: 'Includes drafts, so this is admin-only. Newest published first.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'published',
          in: 'query',
          schema: { type: 'string', enum: ['true', 'false'] },
          description: 'Filter by published status',
        },
        {
          name: 'category',
          in: 'query',
          schema: { type: 'string' },
          description: 'Filter by category',
        },
      ],
      responses: {
        '200': {
          description: 'List of articles, without bodies',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/ArticleSummaryResponse' },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ['Articles'],
      summary: 'Create an article',
      description:
        'The slug is derived from the title when omitted, and de-duplicated. HTML fields are sanitised server-side. Publishing triggers a site rebuild.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/CreateArticleRequest' } },
        },
      },
      responses: {
        '201': {
          description: 'Article created',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ArticleResponse' } },
          },
        },
        ...validationError,
      },
    },
  },
  '/api/articles/published': {
    get: {
      tags: ['Articles'],
      summary: 'List published articles',
      description: 'The public listing behind /blog. Newest first.',
      responses: {
        '200': {
          description: 'Published articles, without bodies',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/ArticleSummaryResponse' },
              },
            },
          },
        },
      },
    },
  },
  '/api/articles/slug/{slug}': {
    get: {
      tags: ['Articles'],
      summary: 'Get a published article by slug',
      description: 'The public read behind /blog/:slug. Drafts are never served here.',
      parameters: [
        { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
      ],
      responses: {
        '200': {
          description: 'The article',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ArticleResponse' } },
          },
        },
        ...notFound,
      },
    },
  },
  '/api/articles/images': {
    post: {
      tags: ['Articles'],
      summary: 'Upload an article image',
      description: 'One image for a cover or a picture inside the body. Uploaded to Cloudinary.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                files: { type: 'array', items: { type: 'string', format: 'binary' } },
              },
              required: ['files'],
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Image uploaded',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ArticleImageUploadResponse' },
            },
          },
        },
        ...validationError,
      },
    },
  },
  '/api/articles/bulk': {
    patch: {
      tags: ['Articles'],
      summary: 'Publish or unpublish many articles',
      security: [{ bearerAuth: [] }],
      requestBody: bulkBody,
      responses: {
        '200': {
          description: 'How many rows changed',
          content: {
            'application/json': {
              schema: { type: 'object', properties: { count: { type: 'integer' } } },
            },
          },
        },
        ...validationError,
      },
    },
    delete: {
      tags: ['Articles'],
      summary: 'Delete many articles',
      security: [{ bearerAuth: [] }],
      requestBody: bulkBody,
      responses: {
        '200': {
          description: 'How many rows were deleted',
          content: {
            'application/json': {
              schema: { type: 'object', properties: { count: { type: 'integer' } } },
            },
          },
        },
        ...validationError,
      },
    },
  },
  '/api/articles/{id}': {
    get: {
      tags: ['Articles'],
      summary: 'Get an article by id',
      description: 'Includes drafts, so this is admin-only.',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'cuid' } },
      ],
      responses: {
        '200': {
          description: 'The article',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ArticleResponse' } },
          },
        },
        ...notFound,
      },
    },
    put: {
      tags: ['Articles'],
      summary: 'Update an article',
      description:
        'publishedAt is set on the first publish and never moved afterwards. A change to a published article triggers a site rebuild.',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'cuid' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/UpdateArticleRequest' } },
        },
      },
      responses: {
        '200': {
          description: 'The updated article',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ArticleResponse' } },
          },
        },
        ...validationError,
        ...notFound,
      },
    },
    delete: {
      tags: ['Articles'],
      summary: 'Delete an article',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'cuid' } },
      ],
      responses: {
        '200': {
          description: 'Article deleted',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } },
          },
        },
        ...notFound,
      },
    },
  },
};
