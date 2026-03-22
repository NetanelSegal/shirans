import { projectRepository } from '../repositories/project.repository';
import {
  type ProjectResponse,
  transformProjectToResponse,
} from '../types/project.types';
import { HttpError } from '../middleware/errorHandler';
import { HTTP_STATUS } from '../constants/httpStatus';
import { getServerErrorMessage } from '@/constants/errorMessages';
import { ProjectImageType } from '@prisma/client';
import logger from '../middleware/logger';
import * as cloudinaryService from './cloudinary.service';
import { compressImageBuffer } from '../utils/imageProcessing';

/**
 * Project image operations: Cloudinary upload, delete, reorder.
 * Keeps project.service focused on CRUD and listing.
 */
export const projectImageService = {
  async uploadProjectImages(
    id: string,
    files: Express.Multer.File[],
    metadata: Array<{ type: string; order?: number }>,
  ): Promise<ProjectResponse> {
    try {
      const project = await projectRepository.findById(id);
      if (!project) {
        throw new HttpError(
          HTTP_STATUS.NOT_FOUND,
          getServerErrorMessage('NOT_FOUND.PROJECT_NOT_FOUND'),
        );
      }

      const uploadResults = await Promise.allSettled(
        files.map(async (file, i) => {
          const meta = metadata.at(i);
          if (meta === undefined) {
            throw new HttpError(
              HTTP_STATUS.BAD_REQUEST,
              getServerErrorMessage(
                'VALIDATION.UPLOAD_METADATA_FILE_COUNT_MISMATCH',
              ),
            );
          }
          const folder = `shirans/projects/${id}/${meta.type.toLowerCase()}`;
          const compressed = await compressImageBuffer(file.buffer);
          const result = await cloudinaryService.uploadImage(compressed, folder);
          return {
            url: result.url,
            publicId: result.publicId,
            type: meta.type as ProjectImageType,
            order: meta.order ?? 0,
          };
        }),
      );

      const succeeded = uploadResults.flatMap((r) =>
        r.status === 'fulfilled' ? [r.value] : [],
      );
      const failed = uploadResults.filter((r) => r.status === 'rejected');

      if (failed.length > 0) {
        const cleanupIds = succeeded.map((s) => s.publicId);
        if (cleanupIds.length > 0) {
          await cloudinaryService.deleteImages(cleanupIds).catch((e) =>
            logger.error('Failed to clean up partial uploads', { error: e }),
          );
        }
        logger.error('Some image uploads failed', {
          failedCount: failed.length,
          id,
        });
        const first = failed[0];
        const reason = first?.status === 'rejected' ? first.reason : undefined;
        if (reason instanceof HttpError) {
          throw reason;
        }
        throw new HttpError(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          getServerErrorMessage('SERVER.PROJECT.CLOUDINARY_UPLOAD_FAILED'),
        );
      }

      try {
        await projectRepository.addImages(id, succeeded);
      } catch (dbError) {
        const cleanupIds = succeeded.map((s) => s.publicId);
        if (cleanupIds.length > 0) {
          await cloudinaryService.deleteImages(cleanupIds).catch((e) =>
            logger.error('Failed to clean up after DB failure', {
              error: e,
              id,
            }),
          );
        }
        throw dbError;
      }

      const updatedProject = await projectRepository.findById(id);
      if (!updatedProject) {
        throw new HttpError(
          HTTP_STATUS.NOT_FOUND,
          getServerErrorMessage('NOT_FOUND.PROJECT_NOT_FOUND'),
        );
      }

      return transformProjectToResponse(updatedProject);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      logger.error('Error uploading project images', { error, id });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.PROJECT.UPLOAD_IMAGES_FAILED'),
      );
    }
  },

  async deleteMainImage(id: string): Promise<void> {
    try {
      const project = await projectRepository.findById(id);
      if (!project) {
        throw new HttpError(
          HTTP_STATUS.NOT_FOUND,
          getServerErrorMessage('NOT_FOUND.PROJECT_NOT_FOUND'),
        );
      }

      const mainImage = project.images.find((img) => img.type === 'MAIN');
      if (!mainImage) {
        throw new HttpError(
          HTTP_STATUS.NOT_FOUND,
          getServerErrorMessage('NOT_FOUND.MAIN_IMAGE_NOT_FOUND'),
        );
      }

      if (mainImage.publicId) {
        await cloudinaryService.deleteImage(mainImage.publicId);
      }
      await projectRepository.deleteImage(mainImage.id);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      logger.error('Error deleting main image', { error, id });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.PROJECT.DELETE_MAIN_IMAGE_FAILED'),
      );
    }
  },

  async deleteProjectImages(id: string, imageIds: string[]): Promise<void> {
    try {
      const project = await projectRepository.findById(id);
      if (!project) {
        throw new HttpError(
          HTTP_STATUS.NOT_FOUND,
          getServerErrorMessage('NOT_FOUND.PROJECT_NOT_FOUND'),
        );
      }

      const projectImageIds = project.images.map((img) => img.id);
      const invalidIds = imageIds.filter(
        (imgId) => !projectImageIds.includes(imgId),
      );
      if (invalidIds.length > 0) {
        throw new HttpError(
          HTTP_STATUS.BAD_REQUEST,
          getServerErrorMessage('VALIDATION.IMAGES_NOT_BELONG_TO_PROJECT'),
        );
      }

      const publicIds = project.images
        .filter((img) => imageIds.includes(img.id) && img.publicId)
        .map((img) => img.publicId!);

      if (publicIds.length > 0) {
        await cloudinaryService.deleteImages(publicIds);
      }
      await projectRepository.deleteImages(id, imageIds);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      logger.error('Error deleting project images', { error, id, imageIds });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.PROJECT.DELETE_PROJECT_IMAGES_FAILED'),
      );
    }
  },

  async reorderImages(
    id: string,
    imageIds: string[],
  ): Promise<ProjectResponse> {
    try {
      const project = await projectRepository.findById(id);
      if (!project) {
        throw new HttpError(
          HTTP_STATUS.NOT_FOUND,
          getServerErrorMessage('NOT_FOUND.PROJECT_NOT_FOUND'),
        );
      }

      if (imageIds.length !== project.images.length) {
        throw new HttpError(
          HTTP_STATUS.BAD_REQUEST,
          getServerErrorMessage('VALIDATION.REORDER_IMAGE_IDS_INVALID'),
        );
      }

      const projectImageIds = new Set(project.images.map((img) => img.id));
      const invalidIds = imageIds.filter(
        (imgId) => !projectImageIds.has(imgId),
      );
      if (invalidIds.length > 0) {
        throw new HttpError(
          HTTP_STATUS.BAD_REQUEST,
          getServerErrorMessage('VALIDATION.IMAGES_NOT_BELONG_TO_PROJECT'),
        );
      }

      await projectRepository.reorderImages(id, imageIds);

      const updatedProject = await projectRepository.findById(id);
      if (!updatedProject) {
        throw new HttpError(
          HTTP_STATUS.NOT_FOUND,
          getServerErrorMessage('NOT_FOUND.PROJECT_NOT_FOUND'),
        );
      }

      return transformProjectToResponse(updatedProject);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      logger.error('Error reordering project images', { error, id, imageIds });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.PROJECT.REORDER_IMAGES_FAILED'),
      );
    }
  },
};
