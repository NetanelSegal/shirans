import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { categoryRepository } from '../../src/repositories/category.repository';
import { authService } from '../../src/services/auth.service';
import { UserRole } from '@prisma/client';

// Mock repositories and services BEFORE importing app
vi.mock('../../src/repositories/category.repository', () => ({
  categoryRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByUrlCode: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    hasProjects: vi.fn(),
  },
}));

vi.mock('../../src/repositories/project.repository', () => ({
  projectRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
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
    JWT_REFRESH_EXPIRES_IN: '7d',
    BCRYPT_SALT_ROUNDS: 12,
    COOKIE_SECURE: 'false',
    COOKIE_SAME_SITE: 'strict',
    COOKIE_DOMAIN: '',
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

vi.mock('../../src/services/auth.service', () => ({
  authService: {
    register: vi.fn(),
    login: vi.fn(),
    refreshAccessToken: vi.fn(),
    logout: vi.fn(),
    verifyToken: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

// Import app after all mocks
import app from '../../src/app';

describe('Category Routes Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Public routes ---

  describe('GET /api/categories', () => {
    it('should return 200 with all categories (no auth required)', async () => {
      const mockCategories = [
        {
          id: 'clx123abc456def001',
          title: 'בתים פרטיים',
          urlCode: 'privateHouses',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'clx123abc456def002',
          title: 'דירות',
          urlCode: 'apartments',
          createdAt: '2024-01-02T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      vi.mocked(categoryRepository.findAll).mockResolvedValue(mockCategories);

      const response = await request(app).get('/api/categories');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('title', 'בתים פרטיים');
      expect(response.body[1]).toHaveProperty('urlCode', 'apartments');
    });

    it('should return empty array when no categories exist', async () => {
      vi.mocked(categoryRepository.findAll).mockResolvedValue([]);

      const response = await request(app).get('/api/categories');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  // --- Protected routes: Auth checks ---

  describe('POST /api/categories (auth required)', () => {
    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .post('/api/categories')
        .send({ title: 'Test', urlCode: 'privateHouses' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 when an invalid token is provided', async () => {
      vi.mocked(authService.verifyToken).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', 'Bearer invalid-token')
        .send({ title: 'Test', urlCode: 'privateHouses' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 403 when a non-admin user token is provided', async () => {
      vi.mocked(authService.verifyToken).mockReturnValue({
        userId: 'user123',
        email: 'user@example.com',
        role: UserRole.USER,
      });

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', 'Bearer user-token')
        .send({ title: 'Test', urlCode: 'privateHouses' });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 201 when admin creates a category', async () => {
      vi.mocked(authService.verifyToken).mockReturnValue({
        userId: 'admin123',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
      });

      const mockCategory = {
        id: 'clx123abc456def001',
        title: 'בתים פרטיים',
        urlCode: 'privateHouses' as const,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      vi.mocked(categoryRepository.create).mockResolvedValue(mockCategory);

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', 'Bearer admin-token')
        .send({ title: 'בתים פרטיים', urlCode: 'privateHouses' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'בתים פרטיים');
      expect(response.body).toHaveProperty('urlCode', 'privateHouses');
    });
  });

  describe('PUT /api/categories/:id (auth required)', () => {
    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .put('/api/categories/clx123abc456def001')
        .send({ title: 'Updated' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 403 when a non-admin user token is provided', async () => {
      vi.mocked(authService.verifyToken).mockReturnValue({
        userId: 'user123',
        email: 'user@example.com',
        role: UserRole.USER,
      });

      const response = await request(app)
        .put('/api/categories/clx123abc456def001')
        .set('Authorization', 'Bearer user-token')
        .send({ title: 'Updated' });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 200 when admin updates a category', async () => {
      vi.mocked(authService.verifyToken).mockReturnValue({
        userId: 'admin123',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
      });

      const mockCategory = {
        id: 'clx123abc456def001',
        title: 'Updated Title',
        urlCode: 'privateHouses' as const,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      };

      vi.mocked(categoryRepository.findById).mockResolvedValue(mockCategory);
      vi.mocked(categoryRepository.update).mockResolvedValue(mockCategory);

      const response = await request(app)
        .put('/api/categories/clx123abc456def001')
        .set('Authorization', 'Bearer admin-token')
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'Updated Title');
    });
  });

  describe('DELETE /api/categories/:id (auth required)', () => {
    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .delete('/api/categories/clx123abc456def001');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 403 when a non-admin user token is provided', async () => {
      vi.mocked(authService.verifyToken).mockReturnValue({
        userId: 'user123',
        email: 'user@example.com',
        role: UserRole.USER,
      });

      const response = await request(app)
        .delete('/api/categories/clx123abc456def001')
        .set('Authorization', 'Bearer user-token');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 200 when admin deletes a category', async () => {
      vi.mocked(authService.verifyToken).mockReturnValue({
        userId: 'admin123',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
      });

      vi.mocked(categoryRepository.findById).mockResolvedValue({
        id: 'clx123abc456def001',
        title: 'Test',
        urlCode: 'privateHouses',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      });
      vi.mocked(categoryRepository.hasProjects).mockResolvedValue(false);
      vi.mocked(categoryRepository.delete).mockResolvedValue(undefined);

      const response = await request(app)
        .delete('/api/categories/clx123abc456def001')
        .set('Authorization', 'Bearer admin-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });
});
