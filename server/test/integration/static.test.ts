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

describe('Legacy /uploads static paths', () => {
  it('does not serve project files from Express (images use Cloudinary CDN)', async () => {
    const response = await request(app)
      .get('/uploads/projects/project1/images/main_desktop.webp');

    expect(response.status).toBe(404);
  });

  it('should not serve non-existent paths as image content', async () => {
    const response = await request(app)
      .get('/uploads/projects/nonexistent/image.webp');

    expect(response.headers['content-type']).not.toMatch(/webp/);
  });

  it('does not serve plan files from local /uploads', async () => {
    const response = await request(app)
      .get('/uploads/projects/project1/plans/1_desktop.webp');

    expect(response.status).toBe(404);
  });
});
