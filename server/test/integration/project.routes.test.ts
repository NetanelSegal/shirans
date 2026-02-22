import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import request from 'supertest';
import { projectRepository } from '../../src/repositories/project.repository';

// Mock the repository BEFORE importing app
vi.mock('../../src/repositories/project.repository', () => ({
  projectRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    addImages: vi.fn(),
    deleteImage: vi.fn(),
    deleteImages: vi.fn(),
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

// Mock auth middleware to bypass authentication for tests (unless Authorization header is present)
vi.mock('../../src/middleware/auth.middleware', () => ({
  authenticate: vi.fn((req: any, _res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // Mock admin token
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

// Import app after all mocks (app.ts exports the app instance, not a function)
import app from '../../src/app';

describe('Project Routes Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/projects', () => {
    it('should return 201 with created project', async () => {
      const mockCreatedProject = {
        id: 'clx123abc456def789',
        title: 'New Project',
        description: 'New Description',
        location: 'New Location',
        client: 'New Client',
        isCompleted: false,
        constructionArea: 100,
        favourite: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        categories: [],
        images: [],
      };

      vi.mocked(projectRepository.create).mockResolvedValue(
        mockCreatedProject as never
      );

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', 'Bearer admin-token')
        .send({
          title: 'New Project',
          description: 'New Description',
          location: 'New Location',
          client: 'New Client',
          constructionArea: 100,
          categoryIds: ['clx789xyz123abc456'],
          images: [],
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 'clx123abc456def789');
      expect(response.body).toHaveProperty('title', 'New Project');
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', 'Bearer admin-token')
        .send({
          title: 'Incomplete Project',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.message).toBe('Invalid input data');
    });

    it('should return 400 when categoryIds is empty', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', 'Bearer admin-token')
        .send({
          title: 'New Project',
          description: 'Description',
          location: 'Location',
          client: 'Client',
          constructionArea: 100,
          categoryIds: [],
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid input data');
    });

    it('should return 400 when constructionArea is not positive', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', 'Bearer admin-token')
        .send({
          title: 'New Project',
          description: 'Description',
          location: 'Location',
          client: 'Client',
          constructionArea: -10,
          categoryIds: ['clx789xyz123abc456'],
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid input data');
    });

    it('should return 400 when title is too long', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', 'Bearer admin-token')
        .send({
          title: 'A'.repeat(501),
          description: 'Description',
          location: 'Location',
          client: 'Client',
          constructionArea: 100,
          categoryIds: ['clx789xyz123abc456'],
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid input data');
    });

    it('should validate image URLs', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', 'Bearer admin-token')
        .send({
          title: 'New Project',
          description: 'Description',
          location: 'Location',
          client: 'Client',
          constructionArea: 100,
          categoryIds: ['clx789xyz123abc456'],
          images: [
            {
              url: 'not-a-valid-url',
              type: 'IMAGE',
            },
          ],
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid input data');
    });
  });

  describe('GET /api/projects', () => {
    it('should return 200 with projects array', async () => {
      const mockProjects = [
        {
          id: '1',
          title: 'Test Project',
          description: 'Test Description',
          location: 'Test Location',
          client: 'Test Client',
          isCompleted: true,
          constructionArea: 100,
          favourite: false,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
          categories: [],
          images: [],
        },
      ];

      vi.mocked(projectRepository.findAll).mockResolvedValue(
        mockProjects as never
      );

      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
    });

    it('should filter by category query parameter', async () => {
      vi.mocked(projectRepository.findAll).mockResolvedValue([]);

      await request(app).get('/api/projects?category=clx789xyz123abc456');

      expect(projectRepository.findAll).toHaveBeenCalledWith({
        category: 'clx789xyz123abc456',
      });
    });

    it('should filter by favourite query parameter', async () => {
      vi.mocked(projectRepository.findAll).mockResolvedValue([]);

      await request(app).get('/api/projects?favourite=true');

      expect(projectRepository.findAll).toHaveBeenCalledWith({
        favourite: true,
      });
    });

    it('should filter by isCompleted query parameter', async () => {
      vi.mocked(projectRepository.findAll).mockResolvedValue([]);

      await request(app).get('/api/projects?isCompleted=false');

      expect(projectRepository.findAll).toHaveBeenCalledWith({
        isCompleted: false,
      });
    });
  });

  describe('GET /api/projects/favourites', () => {
    it('should return 200 with favourite projects', async () => {
      vi.mocked(projectRepository.findAll).mockResolvedValue([]);

      const response = await request(app).get('/api/projects/favourites');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(projectRepository.findAll).toHaveBeenCalledWith({
        favourite: true,
      });
    });
  });

  describe('GET /api/projects/single', () => {
    it('should return 200 with project when id is provided', async () => {
      const mockProject = {
        id: 'clx123abc456def789',
        title: 'Test Project',
        description: 'Test Description',
        location: 'Test Location',
        client: 'Test Client',
        isCompleted: true,
        constructionArea: 100,
        favourite: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        categories: [],
        images: [],
      };

      vi.mocked(projectRepository.findById).mockResolvedValue(
        mockProject as never
      );

      const response = await request(app).get(
        '/api/projects/single?id=clx123abc456def789'
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 'clx123abc456def789');
      expect(response.body).toHaveProperty('title', 'Test Project');
    });

    it('should return 400 when id is missing', async () => {
      const response = await request(app).get('/api/projects/single');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.message).toMatch(/id|CUID/);
    });

    it('should return 404 when project not found', async () => {
      vi.mocked(projectRepository.findById).mockResolvedValue(null);

      const response = await request(app).get(
        '/api/projects/single?id=clx999invalid999999'
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PUT /api/projects', () => {
    it('should return 200 with updated project', async () => {
      const mockUpdatedProject = {
        id: 'clx123abc456def789',
        title: 'Updated Title',
        description: 'Updated Description',
        location: 'Test Location',
        client: 'Test Client',
        isCompleted: true,
        constructionArea: 100,
        favourite: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        categories: [],
        images: [],
      };

      vi.mocked(projectRepository.update).mockResolvedValue(
        mockUpdatedProject as never
      );

      const response = await request(app)
        .put('/api/projects')
        .set('Authorization', 'Bearer admin-token')
        .send({
          id: 'clx123abc456def789',
          title: 'Updated Title',
          description: 'Updated Description',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 'clx123abc456def789');
      expect(response.body).toHaveProperty('title', 'Updated Title');
    });

    it('should return 400 when id is missing', async () => {
      const response = await request(app)
        .put('/api/projects')
        .set('Authorization', 'Bearer admin-token')
        .send({
          title: 'Updated Title',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/id|CUID/);
    });

    it('should return 400 when categoryIds is not an array', async () => {
      const response = await request(app)
        .put('/api/projects')
        .set('Authorization', 'Bearer admin-token')
        .send({
          id: 'clx123abc456def789',
          categoryIds: 'not-an-array',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid input data');
    });
  });

  describe('POST /api/projects/uploadImgs', () => {
    it('should return 200 with updated project', async () => {
      const mockProject = {
        id: 'clx123abc456def789',
        title: 'Test Project',
        description: 'Test Description',
        location: 'Test Location',
        client: 'Test Client',
        isCompleted: true,
        constructionArea: 100,
        favourite: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        categories: [],
        images: [],
      };

      const mockProjectWithImages = {
        ...mockProject,
        images: [
          {
            id: 'img1',
            url: 'https://example.com/image.jpg',
            type: 'IMAGE',
            order: 0,
            projectId: 'clx123abc456def789',
            createdAt: new Date(),
          },
        ],
      };

      vi.mocked(projectRepository.findById)
        .mockResolvedValueOnce(mockProject as never)
        .mockResolvedValueOnce(mockProjectWithImages as never);
      vi.mocked(projectRepository.addImages).mockResolvedValue(undefined);

      const response = await request(app)
        .post('/api/projects/uploadImgs')
        .set('Authorization', 'Bearer admin-token')
        .send({
          id: 'clx123abc456def789',
          images: [
            {
              url: 'https://example.com/image.jpg',
              type: 'IMAGE',
            },
          ],
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 'clx123abc456def789');
    });

    it('should return 400 when id is missing', async () => {
      const response = await request(app)
        .post('/api/projects/uploadImgs')
        .set('Authorization', 'Bearer admin-token')
        .send({
          images: [],
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/id|CUID/);
    });

    it('should return 400 when images is missing', async () => {
      const response = await request(app)
        .post('/api/projects/uploadImgs')
        .set('Authorization', 'Bearer admin-token')
        .send({
          id: 'clx123abc456def789',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid input data');
    });

    it('should return 400 when image type is invalid', async () => {
      const response = await request(app)
        .post('/api/projects/uploadImgs')
        .set('Authorization', 'Bearer admin-token')
        .send({
          id: 'clx123abc456def789',
          images: [
            {
              url: 'https://example.com/image.jpg',
              type: 'INVALID_TYPE',
            },
          ],
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid input data');
    });
  });

  describe('DELETE /api/projects', () => {
    it('should return 200 when project is deleted', async () => {
      const mockProject = {
        id: 'clx123abc456def789',
        title: 'Test Project',
        description: 'Test Description',
        location: 'Test Location',
        client: 'Test Client',
        isCompleted: true,
        constructionArea: 100,
        favourite: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        categories: [],
        images: [],
      };

      vi.mocked(projectRepository.delete).mockResolvedValue(
        mockProject as never
      );

      const response = await request(app)
        .delete('/api/projects')
        .set('Authorization', 'Bearer admin-token')
        .send({
          id: 'clx123abc456def789',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('deleted successfully');
    });

    it('should return 400 when id is missing', async () => {
      const response = await request(app)
        .delete('/api/projects')
        .set('Authorization', 'Bearer admin-token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/id|CUID/);
    });

    it('should return 404 when project not found', async () => {
      const prismaError = {
        code: 'P2025',
      };

      vi.mocked(projectRepository.delete).mockRejectedValue(prismaError);

      const response = await request(app)
        .delete('/api/projects')
        .set('Authorization', 'Bearer admin-token')
        .send({
          id: 'clx999invalid999999',
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('DELETE /api/projects/deleteMainImage', () => {
    it('should return 200 when main image is deleted', async () => {
      const mockProject = {
        id: '1',
        title: 'Test Project',
        description: 'Test Description',
        location: 'Test Location',
        client: 'Test Client',
        isCompleted: true,
        constructionArea: 100,
        favourite: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        categories: [],
        images: [
          {
            id: 'img1',
            url: 'https://example.com/main.jpg',
            type: 'MAIN',
            order: 0,
            projectId: '1',
            createdAt: new Date(),
          },
        ],
      };

      vi.mocked(projectRepository.findById).mockResolvedValue(
        mockProject as never
      );
      vi.mocked(projectRepository.deleteImage).mockResolvedValue(undefined);

      const response = await request(app)
        .delete('/api/projects/deleteMainImage')
        .set('Authorization', 'Bearer admin-token')
        .send({
          id: 'clx123abc456def789',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 when id is missing', async () => {
      const response = await request(app)
        .delete('/api/projects/deleteMainImage')
        .set('Authorization', 'Bearer admin-token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/id|CUID/);
    });
  });

  describe('DELETE /api/projects/deleteImages', () => {
    it('should return 200 when images are deleted', async () => {
      const mockProject = {
        id: 'clx123abc456def789',
        title: 'Test Project',
        description: 'Test Description',
        location: 'Test Location',
        client: 'Test Client',
        isCompleted: true,
        constructionArea: 100,
        favourite: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        categories: [],
        images: [
          {
            id: 'clximg123456789abc',
            url: 'https://example.com/img1.jpg',
            type: 'IMAGE',
            order: 0,
            projectId: 'clx123abc456def789',
            createdAt: new Date(),
          },
          {
            id: 'clximg987654321def',
            url: 'https://example.com/img2.jpg',
            type: 'IMAGE',
            order: 1,
            projectId: 'clx123abc456def789',
            createdAt: new Date(),
          },
        ],
      };

      vi.mocked(projectRepository.findById).mockResolvedValue(
        mockProject as never
      );
      vi.mocked(projectRepository.deleteImages).mockResolvedValue(undefined);

      const response = await request(app)
        .delete('/api/projects/deleteImages')
        .set('Authorization', 'Bearer admin-token')
        .send({
          id: 'clx123abc456def789',
          imageIds: ['clximg123456789abc', 'clximg987654321def'],
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 when id is missing', async () => {
      const response = await request(app)
        .delete('/api/projects/deleteImages')
        .set('Authorization', 'Bearer admin-token')
        .send({
          imageIds: ['clximg123456789abc'],
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/id|CUID/);
    });

    it('should return 400 when imageIds is missing', async () => {
      const response = await request(app)
        .delete('/api/projects/deleteImages')
        .set('Authorization', 'Bearer admin-token')
        .send({
          id: 'clx123abc456def789',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid input data');
    });

    it('should return 400 when imageIds contains invalid values', async () => {
      const response = await request(app)
        .delete('/api/projects/deleteImages')
        .set('Authorization', 'Bearer admin-token')
        .send({
          id: 'clx123abc456def789',
          imageIds: ['clximg123456789abc', ''],
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/CUID|valid/);
    });
  });
});
