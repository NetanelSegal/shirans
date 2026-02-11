import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';

// Mock middleware
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

// Import app after all mocks
import app from '../../src/app';

describe('Swagger API Docs Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api-docs', () => {
    it('should return 200 with HTML content', async () => {
      const response = await request(app).get('/api-docs/');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/text\/html/);
    });

    it('should contain Swagger UI markup', async () => {
      const response = await request(app).get('/api-docs/');

      expect(response.status).toBe(200);
      expect(response.text).toContain('swagger-ui');
    });

    it('should serve swagger UI at root path', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/text\/html/);
    });
  });

  describe('GET /api-docs/swagger-ui-init.js', () => {
    it('should serve the swagger initialization script', async () => {
      const response = await request(app).get('/api-docs/swagger-ui-init.js');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/javascript/);
    });

    it('should contain the API title', async () => {
      const response = await request(app).get('/api-docs/swagger-ui-init.js');

      expect(response.text).toContain('Shirans Portfolio API');
    });

    it('should contain the openapi version', async () => {
      const response = await request(app).get('/api-docs/swagger-ui-init.js');

      expect(response.text).toContain('3.0.3');
    });
  });
});
