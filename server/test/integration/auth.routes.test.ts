import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import request from 'supertest';
import { userRepository } from '../../src/repositories/user.repository';
import { authService } from '../../src/services/auth.service';
import { UserRole } from '../../prisma/generated/prisma/enums';

// Mock the repository and service BEFORE importing app
vi.mock('../../src/repositories/user.repository', () => ({
  userRepository: {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    updatePassword: vi.fn(),
  },
}));

vi.mock('../../src/services/auth.service', () => ({
  authService: {
    register: vi.fn(),
    login: vi.fn(),
    verifyToken: vi.fn(),
    getCurrentUser: vi.fn(),
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

describe('Auth Routes Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockToken = 'mock-jwt-token';

      vi.mocked(authService.register).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token', mockToken);
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).toHaveProperty('name', 'Test User');
      expect(response.body.user).toHaveProperty('role', UserRole.USER);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 409 when email already exists', async () => {
      const { HttpError } = await import('../../src/middleware/errorHandler');
      vi.mocked(authService.register).mockRejectedValue(
        new HttpError(409, 'Email already registered')
      );

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'password123',
          name: 'Test User',
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
      expect(response.body.message).toContain('already registered');
    });

    it('should return 400 when validation fails', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123', // Too short
          name: 'A', // Too short
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          // Missing password and name
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockToken = 'mock-jwt-token';

      vi.mocked(authService.login).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token', mockToken);
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 401 with invalid credentials', async () => {
      const { HttpError } = await import('../../src/middleware/errorHandler');
      vi.mocked(authService.login).mockRejectedValue(
        new HttpError(401, 'Invalid email or password')
      );

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should return 400 when validation fails', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: '123', // Too short
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(authService.verifyToken).mockReturnValue({
        userId: 'user123',
        email: 'test@example.com',
        role: UserRole.USER,
      });

      vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 with invalid token', async () => {
      vi.mocked(authService.verifyToken).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 with expired token', async () => {
      vi.mocked(authService.verifyToken).mockImplementation(() => {
        throw new Error('Token expired');
      });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer expired-token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should return success message', async () => {
      const response = await request(app).post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Logged out');
    });
  });

  describe('Protected Routes - Admin Access', () => {
    it('should return 401 when accessing admin route without token', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({
          title: 'Test Project',
          description: 'Test',
          location: 'Test',
          client: 'Test',
          constructionArea: 100,
          categoryIds: ['cat123'],
          images: [],
        });

      expect(response.status).toBe(401);
    });

    it('should return 403 when accessing admin route with non-admin token', async () => {
      vi.mocked(authService.verifyToken).mockReturnValue({
        userId: 'user123',
        email: 'user@example.com',
        role: UserRole.USER, // Regular user, not admin
      });

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', 'Bearer user-token')
        .send({
          title: 'Test Project',
          description: 'Test',
          location: 'Test',
          client: 'Test',
          constructionArea: 100,
          categoryIds: ['cat123'],
          images: [],
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
      expect(response.body.message).toContain('Admin access required');
    });

    it('should allow admin to access admin routes', async () => {
      vi.mocked(authService.verifyToken).mockReturnValue({
        userId: 'admin123',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
      });

      // Mock project repository for successful creation
      const { projectRepository } = await import('../../src/repositories/project.repository');
      vi.mocked(projectRepository.create).mockResolvedValue({
        id: 'proj123',
        title: 'Test Project',
        description: 'Test',
        location: 'Test',
        client: 'Test',
        isCompleted: false,
        constructionArea: 100,
        favourite: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: [],
        images: [],
      } as never);

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', 'Bearer admin-token')
        .send({
          title: 'Test Project',
          description: 'Test',
          location: 'Test',
          client: 'Test',
          constructionArea: 100,
          categoryIds: ['cat123'],
          images: [],
        });

      // Should not be 401 or 403 (might be 400/500 if other validations fail, but auth passed)
      expect([401, 403]).not.toContain(response.status);
    });
  });
});
