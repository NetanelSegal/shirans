import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectService } from './project.service';
import { projectRepository } from '../repositories/project.repository';
import { HttpError } from '../middleware/errorHandler';
import { prisma } from '../config/database';
import type { ProjectFilters } from '../repositories/project.repository';
import type { CategoryUrlCode } from '../../prisma/generated/prisma/enums';

// Mock dependencies
vi.mock('../repositories/project.repository');
vi.mock('../config/database', () => ({
  prisma: {
    projectImage: {
      createMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));
vi.mock('../middleware/logger', () => ({
  default: {
    error: vi.fn(),
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
        _id: '1',
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
        _id: '1',
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
        'Project with id 999 not found'
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
        _id: '1',
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
      });

      await expect(
        projectService.updateProject('999', { title: 'New Title' })
      ).rejects.toThrow(HttpError);
    });
  });

  describe('uploadProjectImages', () => {
    it('should upload images and return updated project', async () => {
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
        .mockResolvedValueOnce({
          ...mockProject,
          images: [
            {
              id: 'img1',
              url: 'https://example.com/new.jpg',
              type: 'IMAGE',
              order: 0,
              projectId: '1',
              createdAt: new Date(),
            },
          ],
        } as never);

      (prisma.projectImage.createMany as ReturnType<typeof vi.fn>).mockResolvedValue({
        count: 1,
      });

      const images = [
        {
          url: 'https://example.com/new.jpg',
          type: 'IMAGE' as const,
          order: 0,
        },
      ];

      const result = await projectService.uploadProjectImages('1', images);

      expect(prisma.projectImage.createMany).toHaveBeenCalledWith({
        data: [
          {
            url: 'https://example.com/new.jpg',
            type: 'IMAGE',
            order: 0,
            projectId: '1',
          },
        ],
      });
      expect(result).toBeDefined();
    });

    it('should throw HttpError 404 when project not found', async () => {
      vi.mocked(projectRepository.findById).mockResolvedValue(null);

      await expect(
        projectService.uploadProjectImages('999', [
          { url: 'https://example.com/img.jpg', type: 'IMAGE' },
        ])
      ).rejects.toThrow(HttpError);
    });
  });

  describe('deleteMainImage', () => {
    it('should delete main image when found', async () => {
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

      await projectService.deleteMainImage('1');

      expect(prisma.projectImage.delete).toHaveBeenCalledWith({
        where: { id: 'img1' },
      });
    });

    it('should throw HttpError 404 when project not found', async () => {
      vi.mocked(projectRepository.findById).mockResolvedValue(null);

      await expect(projectService.deleteMainImage('999')).rejects.toThrow(
        HttpError
      );
    });

    it('should throw HttpError 404 when main image not found', async () => {
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

      await expect(projectService.deleteMainImage('1')).rejects.toThrow(
        HttpError
      );
      await expect(projectService.deleteMainImage('1')).rejects.toThrow(
        'Main image not found'
      );
    });
  });

  describe('deleteProjectImages', () => {
    it('should delete specified images', async () => {
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

      await projectService.deleteProjectImages('1', ['img1', 'img2']);

      expect(prisma.projectImage.deleteMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: ['img1', 'img2'],
          },
          projectId: '1',
        },
      });
    });

    it('should throw HttpError 404 when project not found', async () => {
      vi.mocked(projectRepository.findById).mockResolvedValue(null);

      await expect(
        projectService.deleteProjectImages('999', ['img1'])
      ).rejects.toThrow(HttpError);
    });

    it('should throw HttpError 400 when imageIds do not belong to project', async () => {
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
        ],
      };

      vi.mocked(projectRepository.findById).mockResolvedValue(
        mockProject as never
      );

      await expect(
        projectService.deleteProjectImages('1', ['img1', 'invalid-id'])
      ).rejects.toThrow(HttpError);
      await expect(
        projectService.deleteProjectImages('1', ['img1', 'invalid-id'])
      ).rejects.toThrow('do not belong to project');
    });
  });
});
