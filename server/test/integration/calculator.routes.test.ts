import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { calculatorRepository } from '../../src/repositories/calculator.repository';
import { DEFAULT_CALCULATOR_CONFIG } from '@shirans/shared';

vi.mock('../../src/repositories/calculator.repository', () => ({
  calculatorRepository: {
    getConfig: vi.fn(),
    createLead: vi.fn(),
    findAllLeads: vi.fn(),
    findLeadById: vi.fn(),
    updateLeadReadStatus: vi.fn(),
    deleteLead: vi.fn(),
    updateLeadReadStatusBulk: vi.fn(),
    deleteLeadsBulk: vi.fn(),
    upsertConfig: vi.fn(),
  },
}));

vi.mock('../../src/middleware/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
  requestLogger: vi.fn((_req: unknown, _res: unknown, next: () => void) => {
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
  authenticate: vi.fn((req: { headers: { authorization?: string }; user?: unknown }, _res: unknown, next: () => void) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (token === 'admin-token') {
        req.user = { userId: 'admin123', email: 'admin@example.com', role: 'ADMIN' };
      }
    }
    next();
  }),
}));

vi.mock('../../src/middleware/authorize.middleware', () => ({
  requireAdmin: vi.fn((req: { user?: { role?: string } }, _res: unknown, next: (err?: unknown) => void) => {
    if (!req.user || req.user.role !== 'ADMIN') {
      return next({ statusCode: 403, message: 'Admin access required', name: 'HttpError' });
    }
    next();
  }),
}));

import app from '../../src/app';

const validLeadPayload = {
  name: 'Test User',
  phoneNumber: '0501234567',
  email: 'test@example.com',
  builtAreaSqm: 200,
  constructionFinish: 'standard',
  pool: 'none',
  outdoorAreaSqm: 50,
  outdoorFinish: 'standard',
  kitchen: 'standard',
  carpentry: 'none',
  furniture: 'none',
  equipment: 'none',
  priceDisplay: 'before_vat',
  estimate: 2500000,
};

describe('Calculator Routes Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(calculatorRepository.getConfig).mockResolvedValue(DEFAULT_CALCULATOR_CONFIG);
  });

  describe('GET /api/calculator/config', () => {
    it('should return 200 with config including builtAreaSqmRange', async () => {
      const response = await request(app).get('/api/calculator/config');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('builtAreaSqmRange');
      expect(response.body.builtAreaSqmRange).toEqual({ min: 100, max: 500 });
      expect(response.body).toHaveProperty('constructionBase');
      expect(response.body).toHaveProperty('vatMultiplier');
    });

    it('should return default config when no row in DB', async () => {
      vi.mocked(calculatorRepository.getConfig).mockResolvedValue(DEFAULT_CALCULATOR_CONFIG);

      const response = await request(app).get('/api/calculator/config');

      expect(response.status).toBe(200);
      expect(response.body.builtAreaSqmRange).toEqual({ min: 100, max: 500 });
    });
  });

  describe('POST /api/calculator/leads', () => {
    it('should return 201 when builtAreaSqm is within config range', async () => {
      const mockLead = {
        id: 'clx123',
        ...validLeadPayload,
        estimateMin: 2500000,
        estimateMax: 2500000,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      vi.mocked(calculatorRepository.createLead).mockResolvedValue(mockLead as never);

      const response = await request(app)
        .post('/api/calculator/leads')
        .send(validLeadPayload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 'clx123');
      expect(calculatorRepository.createLead).toHaveBeenCalled();
    });

    it('should return 400 when builtAreaSqm is below config min', async () => {
      const payload = { ...validLeadPayload, builtAreaSqm: 50 };
      vi.mocked(calculatorRepository.getConfig).mockResolvedValue({
        ...DEFAULT_CALCULATOR_CONFIG,
        builtAreaSqmRange: { min: 100, max: 500 },
      });

      const response = await request(app)
        .post('/api/calculator/leads')
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Built area');
      expect(calculatorRepository.createLead).not.toHaveBeenCalled();
    });

    it('should return 400 when builtAreaSqm is above config max', async () => {
      const payload = { ...validLeadPayload, builtAreaSqm: 600 };
      vi.mocked(calculatorRepository.getConfig).mockResolvedValue({
        ...DEFAULT_CALCULATOR_CONFIG,
        builtAreaSqmRange: { min: 100, max: 500 },
      });

      const response = await request(app)
        .post('/api/calculator/leads')
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Built area');
      expect(calculatorRepository.createLead).not.toHaveBeenCalled();
    });
  });
});
