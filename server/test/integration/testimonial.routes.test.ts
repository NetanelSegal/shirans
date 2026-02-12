import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { testimonialRepository } from '../../src/repositories/testimonial.repository';

// Mock the repository BEFORE importing app
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
  authenticate: vi.fn((req: any, _res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (token === 'admin-token') {
        req.user = {
          userId: 'admin123',
          email: 'admin@example.com',
          role: 'ADMIN',
        };
      } else if (token === 'user-token') {
        req.user = {
          userId: 'user123',
          email: 'user@example.com',
          role: 'USER',
        };
      }
    }
    next();
  }),
}));

vi.mock('../../src/middleware/authorize.middleware', () => ({
  requireAdmin: vi.fn((req: any, _res: any, next: any) => {
    if (!req.user || req.user.role !== 'ADMIN') {
      return next({ statusCode: 403, message: 'Admin access required', name: 'HttpError' });
    }
    next();
  }),
  requireAuth: vi.fn((req: any, _res: any, next: any) => {
    if (!req.user) {
      return next({ statusCode: 401, message: 'Authentication required', name: 'HttpError' });
    }
    next();
  }),
}));

import app from '../../src/app';

describe('Testimonial Routes Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/testimonials/published', () => {
    it('should return 200 with published testimonials', async () => {
      const mockTestimonials = [
        {
          id: 'clx123abc456def001',
          name: 'משפחת קליין',
          message: 'ביקורת מצוינת',
          isPublished: true,
          order: 0,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'clx123abc456def002',
          name: 'משפחת חרבי',
          message: 'שירות מעולה',
          isPublished: true,
          order: 1,
          createdAt: '2024-01-02T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      vi.mocked(testimonialRepository.findAll).mockResolvedValue(mockTestimonials);

      const response = await request(app).get('/api/testimonials/published');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('name', 'משפחת קליין');
      expect(response.body[0]).toHaveProperty('isPublished', true);
      expect(response.body[1]).toHaveProperty('name', 'משפחת חרבי');
    });

    it('should return empty array when no published testimonials', async () => {
      vi.mocked(testimonialRepository.findAll).mockResolvedValue([]);

      const response = await request(app).get('/api/testimonials/published');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should call findAll with isPublished filter', async () => {
      vi.mocked(testimonialRepository.findAll).mockResolvedValue([]);

      await request(app).get('/api/testimonials/published');

      expect(testimonialRepository.findAll).toHaveBeenCalledWith({ isPublished: true });
    });
  });

  describe('GET /api/testimonials', () => {
    it('should return 200 with all testimonials', async () => {
      const mockTestimonials = [
        {
          id: 'clx123abc456def001',
          name: 'Test',
          message: 'Message',
          isPublished: true,
          order: 0,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      vi.mocked(testimonialRepository.findAll).mockResolvedValue(mockTestimonials);

      const response = await request(app).get('/api/testimonials');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter by isPublished query param', async () => {
      vi.mocked(testimonialRepository.findAll).mockResolvedValue([]);

      await request(app).get('/api/testimonials?isPublished=true');

      expect(testimonialRepository.findAll).toHaveBeenCalledWith({ isPublished: true });
    });
  });

  describe('POST /api/testimonials', () => {
    it('should return 201 with created testimonial for admin', async () => {
      const mockTestimonial = {
        id: 'clx123abc456def001',
        name: 'Test Name',
        message: 'Test Message',
        isPublished: false,
        order: 0,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      vi.mocked(testimonialRepository.create).mockResolvedValue(mockTestimonial);

      const response = await request(app)
        .post('/api/testimonials')
        .set('Authorization', 'Bearer admin-token')
        .send({ name: 'Test Name', message: 'Test Message' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'Test Name');
    });
  });

  describe('Testimonial response shape', () => {
    it('should match TestimonialResponse interface', async () => {
      const mockTestimonial = {
        id: 'clx123abc456def001',
        name: 'Test',
        message: 'Message',
        isPublished: true,
        order: 0,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      vi.mocked(testimonialRepository.findAll).mockResolvedValue([mockTestimonial]);

      const response = await request(app).get('/api/testimonials/published');

      const testimonial = response.body[0];
      expect(testimonial).toHaveProperty('id');
      expect(testimonial).toHaveProperty('name');
      expect(testimonial).toHaveProperty('message');
      expect(testimonial).toHaveProperty('isPublished');
      expect(testimonial).toHaveProperty('order');
      expect(testimonial).toHaveProperty('createdAt');
      expect(testimonial).toHaveProperty('updatedAt');
      expect(typeof testimonial.id).toBe('string');
      expect(typeof testimonial.name).toBe('string');
      expect(typeof testimonial.message).toBe('string');
      expect(typeof testimonial.isPublished).toBe('boolean');
      expect(typeof testimonial.order).toBe('number');
    });
  });
});
