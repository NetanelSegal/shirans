import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

// Mock dependencies BEFORE importing app
vi.mock('../../src/repositories/project.repository', () => ({
  projectRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));
vi.mock('../../src/repositories/testimonial.repository', () => ({
  testimonialRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    updateOrder: vi.fn(),
  },
}));
vi.mock('../../src/config/database', () => ({
  prisma: {
    projectImage: {
      createMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));
vi.mock('../../src/middleware/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
  requestLogger: vi.fn((_req, _res, next) => {
    next();
  }),
}));
vi.mock('../../src/utils/env', () => ({
  env: {
    PORT: 3000,
    NODE_ENV: 'test' as const,
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    CORS_ORIGIN: 'http://localhost:5174',
    JWT_SECRET: 'test-jwt-secret-key-for-testing-purposes-only',
    JWT_EXPIRES_IN: '7d',
  },
}));
vi.mock('../../src/config/cors', () => ({
  corsOptions: {
    origin: 'http://localhost:5174',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
}));
vi.mock('../../src/middleware/auth.middleware', () => ({
  authenticate: vi.fn((_req: any, _res: any, next: any) => next()),
}));
vi.mock('../../src/middleware/authorize.middleware', () => ({
  requireAdmin: vi.fn((_req: any, _res: any, next: any) => next()),
  requireAuth: vi.fn((_req: any, _res: any, next: any) => next()),
}));

import app from '../../src/app';

describe('Static File Serving', () => {
  it('should serve an existing image file with 200 status', async () => {
    const response = await request(app)
      .get('/uploads/projects/project1/images/main_desktop.webp');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/webp|octet-stream/);
  });

  it('should not serve non-existent files as static content', async () => {
    const response = await request(app)
      .get('/uploads/projects/nonexistent/image.webp');

    // Non-existent static files fall through to other handlers (swagger, etc.)
    // The important thing is it doesn't return a valid image
    expect(response.headers['content-type']).not.toMatch(/webp/);
  });

  it('should serve plan images', async () => {
    const response = await request(app)
      .get('/uploads/projects/project1/plans/1_desktop.webp');

    expect(response.status).toBe(200);
  });
});
