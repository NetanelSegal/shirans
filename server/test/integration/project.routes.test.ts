import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import request from 'supertest';
import { projectRepository } from '../../src/repositories/project.repository';
import { prisma } from '../../src/config/database';

// Mock the repository and database BEFORE importing app
vi.mock('../../src/repositories/project.repository', () => ({
  projectRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
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

// Import app after all mocks (app.ts exports the app instance, not a function)
import app from '../../src/app';

describe('Project Routes Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
      expect(response.body[0]).toHaveProperty('_id');
      expect(response.body[0]).toHaveProperty('title');
    });

    it('should filter by category query parameter', async () => {
      vi.mocked(projectRepository.findAll).mockResolvedValue([]);

      await request(app).get('/api/projects?category=cat1');

      expect(projectRepository.findAll).toHaveBeenCalledWith({
        category: 'cat1',
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
      };

      vi.mocked(projectRepository.findById).mockResolvedValue(
        mockProject as never
      );

      const response = await request(app).get('/api/projects/single?id=1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', '1');
      expect(response.body).toHaveProperty('title', 'Test Project');
    });

    it('should return 400 when id is missing', async () => {
      const response = await request(app).get('/api/projects/single');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.message).toContain('Project ID is required');
    });

    it('should return 404 when project not found', async () => {
      vi.mocked(projectRepository.findById).mockResolvedValue(null);

      const response = await request(app).get('/api/projects/single?id=999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PUT /api/projects', () => {
    it('should return 200 with updated project', async () => {
      const mockUpdatedProject = {
        id: '1',
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
        .send({
          id: '1',
          title: 'Updated Title',
          description: 'Updated Description',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', '1');
      expect(response.body).toHaveProperty('title', 'Updated Title');
    });

    it('should return 400 when id is missing', async () => {
      const response = await request(app)
        .put('/api/projects')
        .send({
          title: 'Updated Title',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Project ID is required');
    });

    it('should return 400 when categoryIds is not an array', async () => {
      const response = await request(app)
        .put('/api/projects')
        .send({
          id: '1',
          categoryIds: 'not-an-array',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('categoryIds must be an array');
    });
  });

  describe('POST /api/projects/uploadImgs', () => {
    it('should return 200 with updated project', async () => {
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
        images: [],
      };

      vi.mocked(projectRepository.findById)
        .mockResolvedValueOnce(mockProject as never)
        .mockResolvedValueOnce(mockProject as never);

      (prisma.projectImage.createMany as ReturnType<typeof vi.fn>).mockResolvedValue({
        count: 1,
      });

      const response = await request(app)
        .post('/api/projects/uploadImgs')
        .send({
          id: '1',
          images: [
            {
              url: 'https://example.com/image.jpg',
              type: 'IMAGE',
            },
          ],
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', '1');
    });

    it('should return 400 when id is missing', async () => {
      const response = await request(app)
        .post('/api/projects/uploadImgs')
        .send({
          images: [],
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Project ID is required');
    });

    it('should return 400 when images is missing', async () => {
      const response = await request(app)
        .post('/api/projects/uploadImgs')
        .send({
          id: '1',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Images array is required');
    });

    it('should return 400 when image type is invalid', async () => {
      const response = await request(app)
        .post('/api/projects/uploadImgs')
        .send({
          id: '1',
          images: [
            {
              url: 'https://example.com/image.jpg',
              type: 'INVALID_TYPE',
            },
          ],
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Image type must be one of');
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
      (prisma.projectImage.delete as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockProject.images[0]
      );

      const response = await request(app)
        .delete('/api/projects/deleteMainImage')
        .send({
          id: '1',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 when id is missing', async () => {
      const response = await request(app)
        .delete('/api/projects/deleteMainImage')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Project ID is required');
    });
  });

  describe('DELETE /api/projects/deleteImages', () => {
    it('should return 200 when images are deleted', async () => {
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
            url: 'https://example.com/img1.jpg',
            type: 'IMAGE',
            order: 0,
            projectId: '1',
            createdAt: new Date(),
          },
          {
            id: 'img2',
            url: 'https://example.com/img2.jpg',
            type: 'IMAGE',
            order: 1,
            projectId: '1',
            createdAt: new Date(),
          },
        ],
      };

      vi.mocked(projectRepository.findById).mockResolvedValue(
        mockProject as never
      );
      (prisma.projectImage.deleteMany as ReturnType<typeof vi.fn>).mockResolvedValue({
        count: 2,
      });

      const response = await request(app)
        .delete('/api/projects/deleteImages')
        .send({
          id: '1',
          imageIds: ['img1', 'img2'],
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 when id is missing', async () => {
      const response = await request(app)
        .delete('/api/projects/deleteImages')
        .send({
          imageIds: ['img1'],
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Project ID is required');
    });

    it('should return 400 when imageIds is missing', async () => {
      const response = await request(app)
        .delete('/api/projects/deleteImages')
        .send({
          id: '1',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('imageIds array is required');
    });

    it('should return 400 when imageIds contains invalid values', async () => {
      const response = await request(app)
        .delete('/api/projects/deleteImages')
        .send({
          id: '1',
          imageIds: ['img1', ''],
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('non-empty strings');
    });
  });
});
