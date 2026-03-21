import {
  projectRepository,
  type ProjectFilters,
} from '../repositories/project.repository';
import {
  type ProjectResponse,
  type UpdateProjectInput,
  transformProjectToResponse,
  transformProjectsToResponse,
} from '../types/project.types';
import { HttpError } from '../middleware/errorHandler';
import { HTTP_STATUS } from '../constants/httpStatus';
import { getServerErrorMessage } from '@/constants/errorMessages';
import { Prisma } from '@prisma/client';
import { ProjectImageType } from '@prisma/client';
import logger from '../middleware/logger';
import * as cloudinaryService from './cloudinary.service';
import { compressImageBuffer } from '../utils/imageProcessing';

/**
 * Project Service
 * Business logic layer for project operations
 */
export const projectService = {
  /**
   * Get all projects with optional filters
   * @param filters - Optional filters for category, favourite, and isCompleted
   * @returns Array of projects in frontend format
   */
  async getAllProjects(filters?: ProjectFilters): Promise<ProjectResponse[]> {
    try {
      const projects = await projectRepository.findAll(filters);
      return transformProjectsToResponse(projects);
    } catch (error) {
      logger.error('Error fetching all projects', { error, filters });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.PROJECT.FETCHS_FAILED'),
      );
    }
  },

  /**
   * Get all favourite projects
   * @returns Array of favourite projects in frontend format
   */
  async getFavouriteProjects(): Promise<ProjectResponse[]> {
    try {
      const projects = await projectRepository.findAll({ favourite: true });
      return transformProjectsToResponse(projects);
    } catch (error) {
      logger.error('Error fetching favourite projects', { error });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.PROJECT.FETCH_FAVOURITES_FAILED'),
      );
    }
  },

  /**
   * Create a new project
   * @param data - Project creation data
   * @returns Created project in frontend format
   */
  async createProject(data: {
    title: string;
    description: string;
    location: string;
    client: string;
    isCompleted: boolean;
    constructionArea: number;
    favourite: boolean;
    categoryIds: string[];
    images: Array<{ url: string; type: string; order?: number }>;
  }): Promise<ProjectResponse> {
    try {
      // Build Prisma create input
      const createData: Prisma.ProjectCreateInput = {
        title: data.title,
        description: data.description,
        location: data.location,
        client: data.client,
        isCompleted: data.isCompleted,
        constructionArea: data.constructionArea,
        favourite: data.favourite,
        categories: {
          connect: data.categoryIds.map((categoryId) => ({ id: categoryId })),
        },
        images: {
          create: data.images.map((img) => ({
            url: img.url,
            type: img.type as ProjectImageType,
            order: img.order ?? 0,
          })),
        },
      };

      const createdProject = await projectRepository.create(createData);
      return transformProjectToResponse(createdProject);
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error as { code: string };
        if (prismaError.code === 'P2002') {
          // Unique constraint violation
          throw new HttpError(
            HTTP_STATUS.CONFLICT,
            getServerErrorMessage('CONFLICT.PROJECT_TITLE_EXISTS'),
          );
        }
        if (prismaError.code === 'P2025') {
          // Related record not found (category)
          throw new HttpError(
            HTTP_STATUS.NOT_FOUND,
            getServerErrorMessage('NOT_FOUND.CATEGORY_NOT_FOUND'),
          );
        }
      }
      logger.error('Error creating project', { error, data });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.PROJECT.CREATE_FAILED'),
      );
    }
  },

  /**
   * Get a single project by ID
   * @param id - Project ID
   * @returns Project in frontend format
   * @throws HttpError 404 if project not found
   */
  async getProjectById(id: string): Promise<ProjectResponse> {
    try {
      const project = await projectRepository.findById(id);
      if (!project) {
        throw new HttpError(
          HTTP_STATUS.NOT_FOUND,
          getServerErrorMessage('NOT_FOUND.PROJECT_NOT_FOUND'),
        );
      }
      return transformProjectToResponse(project);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      logger.error('Error fetching project by ID', { error, id });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.PROJECT.FETCHS_FAILED'),
      );
    }
  },

  /**
   * Update an existing project
   * @param id - Project ID
   * @param data - Project update data
   * @returns Updated project in frontend format
   * @throws HttpError 404 if project not found
   */
  async updateProject(
    id: string,
    data: UpdateProjectInput,
  ): Promise<ProjectResponse> {
    try {
      // Build Prisma update input
      const updateData: Prisma.ProjectUpdateInput = {};

      if (data.title !== undefined) {
        updateData.title = data.title;
      }
      if (data.description !== undefined) {
        updateData.description = data.description;
      }
      if (data.location !== undefined) {
        updateData.location = data.location;
      }
      if (data.client !== undefined) {
        updateData.client = data.client;
      }
      if (data.isCompleted !== undefined) {
        updateData.isCompleted = data.isCompleted;
      }
      if (data.constructionArea !== undefined) {
        updateData.constructionArea = data.constructionArea;
      }
      if (data.favourite !== undefined) {
        updateData.favourite = data.favourite;
      }

      // Handle category relations
      if (data.categoryIds !== undefined) {
        updateData.categories = {
          set: data.categoryIds.map((categoryId) => ({ id: categoryId })),
        };
      }

      const updatedProject = await projectRepository.update(id, updateData);
      return transformProjectToResponse(updatedProject);
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error as {
          code: string;
          meta?: Record<string, unknown>;
        };
        if (prismaError.code === 'P2025') {
          // Differentiate between project not found and category not found
          const cause = prismaError.meta?.cause;
          if (
            typeof cause === 'string' &&
            cause.toLowerCase().includes('category')
          ) {
            throw new HttpError(
              HTTP_STATUS.NOT_FOUND,
              getServerErrorMessage('NOT_FOUND.CATEGORY_NOT_FOUND'),
            );
          }
          throw new HttpError(
            HTTP_STATUS.NOT_FOUND,
            getServerErrorMessage('NOT_FOUND.PROJECT_NOT_FOUND'),
          );
        }
      }
      logger.error('Error updating project', { error, id, data });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.PROJECT.UPDATE_FAILED'),
      );
    }
  },

  /**
   * Upload images to a project via Cloudinary.
   * Accepts multer file buffers + per-file metadata (type, order).
   */
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
          const meta = metadata[i] ?? { type: 'IMAGE' };
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
        // Clean up any images that did upload before throwing
        const cleanupIds = succeeded.map((s) => s.publicId);
        if (cleanupIds.length > 0) {
          await cloudinaryService.deleteImages(cleanupIds).catch((e) =>
            logger.error('Failed to clean up partial uploads', { error: e }),
          );
        }
        logger.error('Some image uploads failed', { failedCount: failed.length, id });
        throw new HttpError(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          getServerErrorMessage('SERVER.PROJECT.CLOUDINARY_UPLOAD_FAILED'),
        );
      }

      await projectRepository.addImages(id, succeeded);

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

  /**
   * Delete the main image from a project
   * @param id - Project ID
   * @throws HttpError 404 if project or main image not found
   */
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

  /**
   * Delete a project
   * @param id - Project ID
   * @throws HttpError 404 if project not found
   */
  async deleteProject(id: string): Promise<void> {
    try {
      const project = await projectRepository.findById(id);
      if (project) {
        const publicIds = project.images
          .filter((img) => img.publicId)
          .map((img) => img.publicId!);
        if (publicIds.length > 0) {
          await cloudinaryService.deleteImages(publicIds);
        }
      }

      await projectRepository.delete(id);
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error as { code: string };
        if (prismaError.code === 'P2025') {
          // Record not found
          throw new HttpError(
            HTTP_STATUS.NOT_FOUND,
            getServerErrorMessage('NOT_FOUND.PROJECT_NOT_FOUND'),
          );
        }
      }
      logger.error('Error deleting project', { error, id });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.PROJECT.DELETE_FAILED'),
      );
    }
  },

  /**
   * Delete specific images from a project
   * @param id - Project ID
   * @param imageIds - Array of image IDs to delete
   * @throws HttpError 404 if project not found
   */
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
