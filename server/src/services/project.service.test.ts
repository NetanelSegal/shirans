import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectService } from './project.service';
import { projectRepository } from '../repositories/project.repository';
import { HttpError } from '../middleware/errorHandler';
import type { ProjectFilters } from '../repositories/project.repository';
import type { CategoryUrlCode } from '@shirans/shared';
import { Prisma } from '@prisma/client';
// Mock dependencies
vi.mock('../repositories/project.repository', () => ({
  projectRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));
vi.mock('../middleware/logger', () => ({
  default: {
    error: vi.fn(),
  },
}));
vi.mock('../utils/env', () => ({
  env: {
    PORT: 3000,
    NODE_ENV: 'test' as const,
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    CORS_ORIGIN: 'http://localhost:5174',
    JWT_SECRET: 'test-jwt-secret-key-for-testing-purposes-only',
    JWT_EXPIRES_IN: '7d',
  },
}));

describe('projectService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllProjects', () => {
    it('should return transformed projects', async () => {
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
          categories: [
            {
              id: 'cat1',
              title: 'Category 1',
              urlCode: 'privateHouses' as CategoryUrlCode,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          images: [
            {
              id: 'img1',
              url: 'https://example.com/main.jpg',
              type: 'MAIN',
              order: 0,
              projectId: '1',
              createdAt: new Date(),
            },
            {
              id: 'img2',
              url: 'https://example.com/image.jpg',
              type: 'IMAGE',
              order: 1,
              projectId: '1',
              createdAt: new Date(),
            },
          ],
        },
      ];

      vi.mocked(projectRepository.findAll).mockResolvedValue(
        mockProjects as never
      );

      const result = await projectService.getAllProjects();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: '1',
        title: 'Test Project',
        categories: ['privateHouses'],
        mainImage: 'https://example.com/main.jpg',
        images: ['https://example.com/image.jpg'],
      });
      expect(projectRepository.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should pass filters to repository', async () => {
      const filters: ProjectFilters = {
        category: 'cat1',
        favourite: true,
        isCompleted: false,
      };

      vi.mocked(projectRepository.findAll).mockResolvedValue([]);

      await projectService.getAllProjects(filters);

      expect(projectRepository.findAll).toHaveBeenCalledWith(filters);
    });

    it('should throw HttpError on repository error', async () => {
      vi.mocked(projectRepository.findAll).mockRejectedValue(
        new Error('Database error')
      );

      await expect(projectService.getAllProjects()).rejects.toThrow(HttpError);
      await expect(projectService.getAllProjects()).rejects.toThrow(
        'Failed to fetch projects'
      );
    });
  });

  describe('getFavouriteProjects', () => {
    it('should return favourite projects', async () => {
      vi.mocked(projectRepository.findAll).mockResolvedValue([]);

      await projectService.getFavouriteProjects();

      expect(projectRepository.findAll).toHaveBeenCalledWith({
        favourite: true,
      });
    });

    it('should throw HttpError on repository error', async () => {
      vi.mocked(projectRepository.findAll).mockRejectedValue(
        new Error('Database error')
      );

      await expect(projectService.getFavouriteProjects()).rejects.toThrow(
        HttpError
      );
    });
  });

  describe('createProject', () => {
    it('should create project and return transformed result', async () => {
      const mockCreatedProject = {
        id: '1',
        title: 'New Project',
        description: 'New Description',
        location: 'New Location',
        client: 'New Client',
        isCompleted: false,
        constructionArea: 100,
        favourite: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        categories: [
          {
            id: 'cat1',
            title: 'Category 1',
            urlCode: 'privateHouses' as CategoryUrlCode,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        images: [],
      };

      vi.mocked(projectRepository.create).mockResolvedValue(
        mockCreatedProject as never
      );

      const createData = {
        title: 'New Project',
        description: 'New Description',
        location: 'New Location',
        client: 'New Client',
        isCompleted: false,
        constructionArea: 100,
        favourite: false,
        categoryIds: ['cat1'],
      };

      const result = await projectService.createProject(createData);

      expect(result).toMatchObject({
        id: '1',
        title: 'New Project',
      });
      expect(projectRepository.create).toHaveBeenCalled();
      const createArg = vi.mocked(projectRepository.create).mock.calls[0][0];
      expect(createArg).not.toHaveProperty('images');
    });

    it('should throw HttpError 409 on duplicate title', async () => {
      const prismaError = {
        code: 'P2002',
      } as Prisma.PrismaClientKnownRequestError;

      vi.mocked(projectRepository.create).mockRejectedValue(prismaError);

      await expect(
        projectService.createProject({
          title: 'Duplicate Title',
          description: 'Description',
          location: 'Location',
          client: 'Client',
          isCompleted: false,
          constructionArea: 100,
          favourite: false,
          categoryIds: ['clx789xyz123abc456'],
        })
      ).rejects.toThrow(HttpError);
      await expect(
        projectService.createProject({
          title: 'Duplicate Title',
          description: 'Description',
          location: 'Location',
          client: 'Client',
          isCompleted: false,
          constructionArea: 100,
          favourite: false,
          categoryIds: ['clx789xyz123abc456'],
        })
      ).rejects.toThrow('already exists');
    });

    it('should throw HttpError 404 when category not found', async () => {
      const prismaError = {
        code: 'P2025',
      } as Prisma.PrismaClientKnownRequestError;

      vi.mocked(projectRepository.create).mockRejectedValue(prismaError);

      await expect(
        projectService.createProject({
          title: 'New Project',
          description: 'Description',
          location: 'Location',
          client: 'Client',
          isCompleted: false,
          constructionArea: 100,
          favourite: false,
          categoryIds: ['clx999invalid999999'],
        })
      ).rejects.toThrow(HttpError);
      await expect(
        projectService.createProject({
          title: 'New Project',
          description: 'Description',
          location: 'Location',
          client: 'Client',
          isCompleted: false,
          constructionArea: 100,
          favourite: false,
          categoryIds: ['clx999invalid999999'],
        })
      ).rejects.toThrow('categories not found');
    });

    it('should throw HttpError on repository error', async () => {
      vi.mocked(projectRepository.create).mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        projectService.createProject({
          title: 'New Project',
          description: 'Description',
          location: 'Location',
          client: 'Client',
          isCompleted: false,
          constructionArea: 100,
          favourite: false,
          categoryIds: ['cat1'],
        })
      ).rejects.toThrow(HttpError);
    });
  });

  describe('getProjectById', () => {
    it('should return transformed project when found', async () => {
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

      const result = await projectService.getProjectById('1');

      expect(result).toMatchObject({
        id: '1',
        title: 'Test Project',
      });
      expect(projectRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw HttpError 404 when project not found', async () => {
      vi.mocked(projectRepository.findById).mockResolvedValue(null);

      await expect(projectService.getProjectById('999')).rejects.toThrow(
        HttpError
      );
      await expect(projectService.getProjectById('999')).rejects.toThrow(
        'Project not found'
      );
    });

    it('should throw HttpError on repository error', async () => {
      vi.mocked(projectRepository.findById).mockRejectedValue(
        new Error('Database error')
      );

      await expect(projectService.getProjectById('1')).rejects.toThrow(
        HttpError
      );
    });
  });

  describe('updateProject', () => {
    it('should update project and return transformed result', async () => {
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

      vi.mocked(projectRepository.findById).mockResolvedValue(
        mockUpdatedProject as never
      );
      vi.mocked(projectRepository.update).mockResolvedValue(
        mockUpdatedProject as never
      );

      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description',
      };

      const result = await projectService.updateProject('1', updateData);

      expect(result).toMatchObject({
        id: '1',
        title: 'Updated Title',
      });
      expect(projectRepository.update).toHaveBeenCalled();
    });

    it('should handle categoryIds update', async () => {
      const mockUpdatedProject = {
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

      vi.mocked(projectRepository.update).mockResolvedValue(
        mockUpdatedProject as never
      );

      await projectService.updateProject('1', {
        categoryIds: ['cat1', 'cat2'],
      });

      expect(projectRepository.update).toHaveBeenCalledWith('1', {
        categories: {
          set: [{ id: 'cat1' }, { id: 'cat2' }],
        },
      });
    });

    it('should throw HttpError 404 when project not found', async () => {
      vi.mocked(projectRepository.update).mockRejectedValue({
        code: 'P2025',
        meta: { cause: 'Record to update not found.' },
      });

      await expect(
        projectService.updateProject('999', { title: 'New Title' })
      ).rejects.toThrow(HttpError);
      await expect(
        projectService.updateProject('999', { title: 'New Title' })
      ).rejects.toThrow('Project not found');
    });

    it('should throw HttpError 404 when category not found during update', async () => {
      vi.mocked(projectRepository.update).mockRejectedValue({
        code: 'P2025',
        meta: {
          cause:
            "No 'Category' record(s) (needed to inline the relation on 'Project' record(s)) was found for a nested set on one-to-many relation 'CategoryToProject'.",
        },
      });

      await expect(
        projectService.updateProject('1', {
          categoryIds: ['clx999invalid999999'],
        })
      ).rejects.toThrow(HttpError);
      await expect(
        projectService.updateProject('1', {
          categoryIds: ['clx999invalid999999'],
        })
      ).rejects.toThrow('categories not found');
    });

    it('should throw HttpError on repository error', async () => {
      vi.mocked(projectRepository.update).mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        projectService.updateProject('1', { title: 'New Title' })
      ).rejects.toThrow(HttpError);
      await expect(
        projectService.updateProject('1', { title: 'New Title' })
      ).rejects.toThrow('Failed to update project');
    });
  });

  describe('deleteProject', () => {
    it('should delete project successfully', async () => {
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

      vi.mocked(projectRepository.delete).mockResolvedValue(
        mockProject as never
      );

      await projectService.deleteProject('1');

      expect(projectRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should delete all Cloudinary assets before DB delete when publicIds exist', async () => {
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
            id: 'i1',
            url: 'https://res.cloudinary.com/x/1.webp',
            publicId: 'a/1',
            type: 'MAIN',
            order: 0,
            projectId: '1',
            createdAt: new Date(),
          },
          {
            id: 'i2',
            url: 'https://example.com/legacy.jpg',
            publicId: null,
            type: 'IMAGE',
            order: 1,
            projectId: '1',
            createdAt: new Date(),
          },
        ],
      };

      vi.mocked(projectRepository.findById).mockResolvedValue(
        mockProject as never,
      );
      vi.mocked(projectRepository.delete).mockResolvedValue(mockProject as never);

      const cloudinaryService = await import('./cloudinary.service');
      const bulkSpy = vi
        .spyOn(cloudinaryService, 'deleteImages')
        .mockResolvedValue(undefined);

      await projectService.deleteProject('1');

      expect(bulkSpy).toHaveBeenCalledWith(['a/1']);
      expect(projectRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw HttpError 404 when project not found', async () => {
      const prismaError = {
        code: 'P2025',
      };

      vi.mocked(projectRepository.delete).mockRejectedValue(prismaError);

      await expect(projectService.deleteProject('999')).rejects.toThrow(
        HttpError
      );
      await expect(projectService.deleteProject('999')).rejects.toThrow(
        'not found'
      );
    });

    it('should throw HttpError on repository error', async () => {
      vi.mocked(projectRepository.delete).mockRejectedValue(
        new Error('Database error')
      );

      await expect(projectService.deleteProject('1')).rejects.toThrow(
        HttpError
      );
    });
  });
});
