import { categoryRepository } from '../repositories/category.repository';
import type {
  CategoryRequest,
  CategoryResponse,
} from '../types/category.types';
import { HttpError } from '../middleware/errorHandler';
import { HTTP_STATUS } from '../constants/httpStatus';
import { getServerErrorMessage } from '@/constants/errorMessages';
import { Prisma } from '@prisma/client';
import logger from '../middleware/logger';

/**
 * Category Service
 * Business logic layer for category operations
 */
export const categoryService = {
  /**
   * Get all categories
   * @returns Array of categories
   */
  async getAllCategories(): Promise<CategoryResponse[]> {
    try {
      return await categoryRepository.findAll();
    } catch (error) {
      logger.error('Error fetching all categories', { error });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.CATEGORY.FETCHS_FAILED'),
      );
    }
  },

  /**
   * Get a category by ID
   * @param id - Category ID
   * @returns Category
   * @throws HttpError 404 if category not found
   */
  async getCategoryById(id: string): Promise<CategoryResponse> {
    try {
      const category = await categoryRepository.findById(id);
      if (!category) {
        throw new HttpError(
          HTTP_STATUS.NOT_FOUND,
          getServerErrorMessage('NOT_FOUND.CATEGORY_NOT_FOUND'),
        );
      }
      return category;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      logger.error('Error fetching category by ID', { error, id });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.CATEGORY.FETCH_BY_ID_FAILED'),
      );
    }
  },

  /**
   * Create a new category
   * @param data - Category data
   * @returns Created category
   * @throws HttpError 409 if urlCode already exists
   */
  async createCategory(data: CategoryRequest): Promise<CategoryResponse> {
    try {
      // Check if urlCode already exists
      const existing = await categoryRepository.findByUrlCode(data.urlCode);
      if (existing) {
        throw new HttpError(
          HTTP_STATUS.CONFLICT,
          getServerErrorMessage('CONFLICT.CATEGORY_URL_CODE_EXISTS'),
        );
      }

      return await categoryRepository.create(data);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpError(
            HTTP_STATUS.CONFLICT,
            getServerErrorMessage('CONFLICT.CATEGORY_URL_CODE_EXISTS'),
          );
        }
      }
      logger.error('Error creating category', { error });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.CATEGORY.CREATE_FAILED'),
      );
    }
  },

  /**
   * Update a category
   * @param id - Category ID
   * @param data - Partial category data
   * @returns Updated category
   * @throws HttpError 404 if category not found
   * @throws HttpError 409 if urlCode already exists
   */
  async updateCategory(
    id: string,
    data: Partial<CategoryRequest>,
  ): Promise<CategoryResponse> {
    try {
      // Check if category exists
      await this.getCategoryById(id);

      // Check if urlCode is being updated and already exists
      if (data.urlCode) {
        const existing = await categoryRepository.findByUrlCode(data.urlCode);
        if (existing && existing.id !== id) {
          throw new HttpError(
            HTTP_STATUS.CONFLICT,
            getServerErrorMessage('CONFLICT.CATEGORY_URL_CODE_EXISTS'),
          );
        }
      }

      return await categoryRepository.update(id, data);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpError(
            HTTP_STATUS.CONFLICT,
            getServerErrorMessage('CONFLICT.CATEGORY_URL_CODE_EXISTS'),
          );
        }
        if (error.code === 'P2025') {
          throw new HttpError(
            HTTP_STATUS.NOT_FOUND,
            getServerErrorMessage('NOT_FOUND.CATEGORY_NOT_FOUND'),
          );
        }
      }
      logger.error('Error updating category', { error, id });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.CATEGORY.UPDATE_FAILED'),
      );
    }
  },

  /**
   * Delete a category
   * @param id - Category ID
   * @throws HttpError 404 if category not found
   * @throws HttpError 409 if category has associated projects
   */
  async deleteCategory(id: string): Promise<void> {
    try {
      // Check if category exists
      await this.getCategoryById(id);

      // Check if category has associated projects
      const hasProjects = await categoryRepository.hasProjects(id);
      if (hasProjects) {
        throw new HttpError(
          HTTP_STATUS.CONFLICT,
          getServerErrorMessage('CONFLICT.CATEGORY_HAS_ASSOCIATED_PROJECTS'),
        );
      }

      await categoryRepository.delete(id);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new HttpError(
            HTTP_STATUS.NOT_FOUND,
            getServerErrorMessage('NOT_FOUND.CATEGORY_NOT_FOUND'),
          );
        }
      }
      logger.error('Error deleting category', { error, id });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.CATEGORY.DELETE_FAILED'),
      );
    }
  },
};
