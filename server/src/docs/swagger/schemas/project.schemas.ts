export const projectSchemas = {
  ImageInput: {
    type: 'object',
    properties: {
      url: { type: 'string', format: 'uri' },
      type: {
        type: 'string',
        enum: ['MAIN', 'IMAGE', 'PLAN', 'VIDEO'],
      },
      order: { type: 'integer', minimum: 0 },
    },
    required: ['url', 'type'],
  },
  ProjectResponse: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'cuid' },
      title: { type: 'string' },
      categories: {
        type: 'array',
        items: { $ref: '#/components/schemas/CategoryUrlCode' },
      },
      description: { type: 'string' },
      mainImage: {
        oneOf: [
          { type: 'string', format: 'uri' },
          { $ref: '#/components/schemas/ResponsiveImage' },
        ],
      },
      images: {
        type: 'array',
        items: {
          oneOf: [
            { type: 'string', format: 'uri' },
            { $ref: '#/components/schemas/ResponsiveImage' },
          ],
        },
      },
      plans: {
        type: 'array',
        items: {
          oneOf: [
            { type: 'string', format: 'uri' },
            { $ref: '#/components/schemas/ResponsiveImage' },
          ],
        },
      },
      videos: {
        type: 'array',
        items: { type: 'string', format: 'uri' },
      },
      location: { type: 'string' },
      client: { type: 'string' },
      isCompleted: { type: 'boolean' },
      constructionArea: { type: 'integer' },
      favourite: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: [
      'id',
      'title',
      'categories',
      'description',
      'mainImage',
      'images',
      'location',
      'client',
      'isCompleted',
      'constructionArea',
      'favourite',
    ],
  },
  CreateProjectRequest: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 1, maxLength: 500 },
      description: { type: 'string', minLength: 1 },
      location: { type: 'string', minLength: 1, maxLength: 200 },
      client: { type: 'string', minLength: 1, maxLength: 200 },
      isCompleted: { type: 'boolean', default: false },
      constructionArea: { type: 'integer', minimum: 1 },
      favourite: { type: 'boolean', default: false },
      categoryIds: {
        type: 'array',
        items: { type: 'string', format: 'cuid' },
        minItems: 1,
      },
      images: {
        type: 'array',
        items: { $ref: '#/components/schemas/ImageInput' },
        default: [],
      },
    },
    required: [
      'title',
      'description',
      'location',
      'client',
      'constructionArea',
      'categoryIds',
    ],
  },
  UpdateProjectRequest: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'cuid' },
      title: { type: 'string', minLength: 1, maxLength: 500 },
      description: { type: 'string', minLength: 1 },
      location: { type: 'string', minLength: 1, maxLength: 200 },
      client: { type: 'string', minLength: 1, maxLength: 200 },
      isCompleted: { type: 'boolean' },
      constructionArea: { type: 'integer', minimum: 1 },
      favourite: { type: 'boolean' },
      categoryIds: {
        type: 'array',
        items: { type: 'string', format: 'cuid' },
      },
    },
    required: ['id'],
  },
  UploadImagesRequest: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'cuid' },
      images: {
        type: 'array',
        items: { $ref: '#/components/schemas/ImageInput' },
        minItems: 1,
      },
    },
    required: ['id', 'images'],
  },
  DeleteProjectRequest: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'cuid' },
    },
    required: ['id'],
  },
  DeleteMainImageRequest: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'cuid' },
    },
    required: ['id'],
  },
  DeleteImagesRequest: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'cuid' },
      imageIds: {
        type: 'array',
        items: { type: 'string', format: 'cuid' },
        minItems: 1,
      },
    },
    required: ['id', 'imageIds'],
  },
} as const;
