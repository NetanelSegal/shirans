import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

import { commonSchemas } from './schemas/common.schemas';
import { authSchemas } from './schemas/auth.schemas';
import { projectSchemas } from './schemas/project.schemas';
import { categorySchemas } from './schemas/category.schemas';
import { contactSchemas } from './schemas/contact.schemas';
import { testimonialSchemas } from './schemas/testimonial.schemas';

import { healthPaths } from './paths/health.paths';
import { authPaths } from './paths/auth.paths';
import { projectsPaths } from './paths/projects.paths';
import { categoriesPaths } from './paths/categories.paths';
import { contactPaths } from './paths/contact.paths';
import { testimonialsPaths } from './paths/testimonials.paths';

const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Shirans Portfolio API',
    version: '1.0.0',
    description:
      'REST API for the Shirans architecture/interior design portfolio. Manages projects, categories, contacts, testimonials, and authentication.',
  },
  servers: [
    {
      url: '/',
      description: 'Development server',
    },
  ],
  tags: [
    { name: 'Health', description: 'Health check endpoint' },
    { name: 'Auth', description: 'Authentication and authorization' },
    { name: 'Projects', description: 'Project management' },
    { name: 'Categories', description: 'Project category management' },
    { name: 'Contact', description: 'Contact form submissions' },
    {
      name: 'Testimonials',
      description: 'Testimonial management (routes not yet mounted in app)',
    },
  ],
  paths: {
    ...healthPaths,
    ...authPaths,
    ...projectsPaths,
    ...categoriesPaths,
    ...contactPaths,
    ...testimonialsPaths,
  },
  components: {
    schemas: {
      ...commonSchemas,
      ...authSchemas,
      ...projectSchemas,
      ...categorySchemas,
      ...contactSchemas,
      ...testimonialSchemas,
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'JWT access token obtained from /api/auth/login or /api/auth/register',
      },
    },
  },
};

export function setupSwagger(app: Express): void {
  app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
