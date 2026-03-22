import type { UploadImageMetadata } from '@shirans/shared';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectImageService } from './projectImage.service';
import { projectRepository } from '../repositories/project.repository';
import { HttpError } from '../middleware/errorHandler';
import { compressImageBuffer } from '../utils/imageProcessing';

vi.mock('../repositories/project.repository', () => ({
  projectRepository: {
    findById: vi.fn(),
    addImages: vi.fn(),
    deleteImage: vi.fn(),
    deleteImages: vi.fn(),
    reorderImages: vi.fn(),
  },
}));
vi.mock('../middleware/logger', () => ({
  default: {
    error: vi.fn(),
  },
}));
vi.mock('../utils/imageProcessing', () => ({
  compressImageBuffer: vi.fn((buffer: Buffer) => Promise.resolve(buffer)),
}));

describe('projectImageService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

      vi.mocked(projectRepository.addImages).mockResolvedValue(undefined);

      const mockFiles = [
        { buffer: Buffer.from('fake'), originalname: 'new.jpg', mimetype: 'image/jpeg' },
      ] as Express.Multer.File[];

      const metadata = [{ type: 'IMAGE', order: 0 }] satisfies UploadImageMetadata[];

      const cloudinaryService = await import('./cloudinary.service');
      vi.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue({
        url: 'https://res.cloudinary.com/test/image.webp',
        publicId: 'shirans/projects/1/image/abc',
      });

      const result = await projectImageService.uploadProjectImages(
        '1',
        mockFiles,
        metadata,
      );

      expect(compressImageBuffer).toHaveBeenCalledWith(mockFiles[0].buffer);
      expect(projectRepository.addImages).toHaveBeenCalledWith(
        '1',
        expect.arrayContaining([
          expect.objectContaining({
            url: 'https://res.cloudinary.com/test/image.webp',
            publicId: 'shirans/projects/1/image/abc',
            type: 'IMAGE',
            order: 0,
          }),
        ]),
      );
      expect(result).toBeDefined();
    });

    it('should compress each file before Cloudinary upload (parallel)', async () => {
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
          images: [],
        } as never);

      vi.mocked(projectRepository.addImages).mockResolvedValue(undefined);

      const bufA = Buffer.from('a');
      const bufB = Buffer.from('b');
      const mockFiles = [
        { buffer: bufA, originalname: 'a.jpg', mimetype: 'image/jpeg' },
        { buffer: bufB, originalname: 'b.jpg', mimetype: 'image/jpeg' },
      ] as Express.Multer.File[];

      const cloudinaryService = await import('./cloudinary.service');
      vi.spyOn(cloudinaryService, 'uploadImage')
        .mockResolvedValueOnce({
          url: 'https://res.cloudinary.com/test/1.webp',
          publicId: 'p1',
        })
        .mockResolvedValueOnce({
          url: 'https://res.cloudinary.com/test/2.webp',
          publicId: 'p2',
        });

      await projectImageService.uploadProjectImages(
        '1',
        mockFiles,
        [
          { type: 'IMAGE', order: 0 },
          { type: 'PLAN', order: 1 },
        ] satisfies UploadImageMetadata[],
      );

      expect(compressImageBuffer).toHaveBeenCalledTimes(2);
      expect(compressImageBuffer).toHaveBeenNthCalledWith(1, bufA);
      expect(compressImageBuffer).toHaveBeenNthCalledWith(2, bufB);
      expect(cloudinaryService.uploadImage).toHaveBeenCalledTimes(2);
    });

    it('should delete partial Cloudinary uploads and throw when one upload fails', async () => {
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

      vi.mocked(projectRepository.findById).mockResolvedValue(mockProject as never);

      const mockFiles = [
        { buffer: Buffer.from('a'), originalname: 'a.jpg', mimetype: 'image/jpeg' },
        { buffer: Buffer.from('b'), originalname: 'b.jpg', mimetype: 'image/jpeg' },
      ] as Express.Multer.File[];

      const cloudinaryService = await import('./cloudinary.service');
      const deleteSpy = vi
        .spyOn(cloudinaryService, 'deleteImages')
        .mockResolvedValue(undefined);
      vi.spyOn(cloudinaryService, 'uploadImage')
        .mockResolvedValueOnce({
          url: 'https://res.cloudinary.com/test/ok.webp',
          publicId: 'uploaded-ok',
        })
        .mockRejectedValueOnce(new Error('Cloudinary down'));

      await expect(
        projectImageService.uploadProjectImages(
          '1',
          mockFiles,
          [{ type: 'IMAGE' }, { type: 'IMAGE' }] satisfies UploadImageMetadata[],
        ),
      ).rejects.toThrow(HttpError);

      expect(deleteSpy).toHaveBeenCalledWith(['uploaded-ok']);
      expect(projectRepository.addImages).not.toHaveBeenCalled();
    });

    it('should delete Cloudinary uploads when addImages fails after successful upload', async () => {
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

      vi.mocked(projectRepository.findById).mockResolvedValue(mockProject as never);
      vi.mocked(projectRepository.addImages).mockRejectedValue(
        new Error('DB write failed'),
      );

      const mockFiles = [
        { buffer: Buffer.from('x'), originalname: 'x.jpg', mimetype: 'image/jpeg' },
      ] as Express.Multer.File[];

      const cloudinaryService = await import('./cloudinary.service');
      vi.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue({
        url: 'https://res.cloudinary.com/test/x.webp',
        publicId: 'pid-after-db-fail',
      });
      const deleteSpy = vi
        .spyOn(cloudinaryService, 'deleteImages')
        .mockResolvedValue(undefined);

      await expect(
        projectImageService.uploadProjectImages(
          '1',
          mockFiles,
          [{ type: 'IMAGE' }] satisfies UploadImageMetadata[],
        ),
      ).rejects.toThrow(HttpError);

      expect(deleteSpy).toHaveBeenCalledWith(['pid-after-db-fail']);
    });

    it('should throw HttpError 404 when project not found', async () => {
      vi.mocked(projectRepository.findById).mockResolvedValue(null);

      const mockFiles = [
        { buffer: Buffer.from('fake'), originalname: 'img.jpg', mimetype: 'image/jpeg' },
      ] as Express.Multer.File[];

      await expect(
        projectImageService.uploadProjectImages(
          '999',
          mockFiles,
          [{ type: 'IMAGE' }] satisfies UploadImageMetadata[],
        ),
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
        mockProject as never,
      );
      vi.mocked(projectRepository.deleteImage).mockResolvedValue(undefined);

      await projectImageService.deleteMainImage('1');

      expect(projectRepository.deleteImage).toHaveBeenCalledWith('img1');
    });

    it('should delete from Cloudinary when main image has publicId', async () => {
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
            url: 'https://res.cloudinary.com/x/main.webp',
            publicId: 'folder/main',
            type: 'MAIN',
            order: 0,
            projectId: '1',
            createdAt: new Date(),
          },
        ],
      };

      vi.mocked(projectRepository.findById).mockResolvedValue(
        mockProject as never,
      );
      vi.mocked(projectRepository.deleteImage).mockResolvedValue(undefined);

      const cloudinaryService = await import('./cloudinary.service');
      const destroySpy = vi
        .spyOn(cloudinaryService, 'deleteImage')
        .mockResolvedValue(undefined);

      await projectImageService.deleteMainImage('1');

      expect(destroySpy).toHaveBeenCalledWith('folder/main');
      expect(projectRepository.deleteImage).toHaveBeenCalledWith('img1');
    });

    it('should throw HttpError 404 when project not found', async () => {
      vi.mocked(projectRepository.findById).mockResolvedValue(null);

      await expect(projectImageService.deleteMainImage('999')).rejects.toThrow(
        HttpError,
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
        mockProject as never,
      );

      await expect(projectImageService.deleteMainImage('1')).rejects.toThrow(
        HttpError,
      );
      await expect(projectImageService.deleteMainImage('1')).rejects.toThrow(
        'Main image not found',
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
        mockProject as never,
      );
      vi.mocked(projectRepository.deleteImages).mockResolvedValue(undefined);

      await projectImageService.deleteProjectImages('1', ['img1', 'img2']);

      expect(projectRepository.deleteImages).toHaveBeenCalledWith('1', [
        'img1',
        'img2',
      ]);
    });

    it('should throw HttpError 404 when project not found', async () => {
      vi.mocked(projectRepository.findById).mockResolvedValue(null);

      await expect(
        projectImageService.deleteProjectImages('999', ['img1']),
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
        mockProject as never,
      );

      await expect(
        projectImageService.deleteProjectImages('1', ['img1', 'invalid-id']),
      ).rejects.toThrow(HttpError);
      await expect(
        projectImageService.deleteProjectImages('1', ['img1', 'invalid-id']),
      ).rejects.toThrow('do not belong to project');
    });

    it('should delete from Cloudinary when images have publicId', async () => {
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
            url: 'https://res.cloudinary.com/x/img.webp',
            publicId: 'folder/img1',
            type: 'IMAGE',
            order: 0,
            projectId: '1',
            createdAt: new Date(),
          },
        ],
      };

      vi.mocked(projectRepository.findById).mockResolvedValue(
        mockProject as never,
      );
      vi.mocked(projectRepository.deleteImages).mockResolvedValue(undefined);

      const cloudinaryService = await import('./cloudinary.service');
      const deleteSpy = vi
        .spyOn(cloudinaryService, 'deleteImages')
        .mockResolvedValue(undefined);

      await projectImageService.deleteProjectImages('1', ['img1']);

      expect(deleteSpy).toHaveBeenCalledWith(['folder/img1']);
      expect(projectRepository.deleteImages).toHaveBeenCalledWith('1', ['img1']);
    });
  });

  describe('reorderImages', () => {
    it('should reorder and return updated project', async () => {
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
            id: 'img-a',
            url: 'https://example.com/a.jpg',
            type: 'IMAGE',
            order: 0,
            projectId: '1',
            createdAt: new Date(),
          },
          {
            id: 'img-b',
            url: 'https://example.com/b.jpg',
            type: 'IMAGE',
            order: 1,
            projectId: '1',
            createdAt: new Date(),
          },
        ],
      };

      const reordered = {
        ...mockProject,
        images: [
          { ...mockProject.images[1], order: 0 },
          { ...mockProject.images[0], order: 1 },
        ],
      };

      vi.mocked(projectRepository.findById)
        .mockResolvedValueOnce(mockProject as never)
        .mockResolvedValueOnce(reordered as never);
      vi.mocked(projectRepository.reorderImages).mockResolvedValue(undefined);

      const result = await projectImageService.reorderImages('1', [
        'img-b',
        'img-a',
      ]);

      expect(projectRepository.reorderImages).toHaveBeenCalledWith('1', [
        'img-b',
        'img-a',
      ]);
      expect(result.id).toBe('1');
    });

    it('should throw HttpError 404 when project not found', async () => {
      vi.mocked(projectRepository.findById).mockResolvedValue(null);

      await expect(
        projectImageService.reorderImages('999', ['img-a']),
      ).rejects.toThrow(HttpError);
    });

    it('should throw HttpError 400 when image id not in project', async () => {
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
            id: 'img-a',
            url: 'https://example.com/a.jpg',
            type: 'IMAGE',
            order: 0,
            projectId: '1',
            createdAt: new Date(),
          },
          {
            id: 'img-b',
            url: 'https://example.com/b.jpg',
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

      await expect(
        projectImageService.reorderImages('1', ['img-a', 'unknown']),
      ).rejects.toThrow(HttpError);
    });

    it('should throw HttpError 400 when imageIds length does not match project images', async () => {
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
            id: 'img-a',
            url: 'https://example.com/a.jpg',
            type: 'IMAGE',
            order: 0,
            projectId: '1',
            createdAt: new Date(),
          },
          {
            id: 'img-b',
            url: 'https://example.com/b.jpg',
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

      await expect(
        projectImageService.reorderImages('1', ['img-a']),
      ).rejects.toThrow(HttpError);

      expect(projectRepository.reorderImages).not.toHaveBeenCalled();
    });
  });
});
