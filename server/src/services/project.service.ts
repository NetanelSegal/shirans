import {
  projectRepository,
  type ProjectFilters,
} from '../repositories/project.repository';
import type { CreateProjectInput } from '@shirans/shared';
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
import logger from '../middleware/logger';
import * as cloudinaryService from './cloudinary.service';

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
  async createProject(data: CreateProjectInput): Promise<ProjectResponse> {
    try {
      // Build Prisma create input (images are added via multipart upload, not JSON create)
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
      if (error instanceof HttpError) {
        throw error;
      }
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
};
