import { prisma } from '../config/database';
import { CategoryUrlCode } from '@prisma/client';
import type { CategoryResponse } from '../types/category.types';

/**
 * Category Repository
 * Handles all database access for Categories using Prisma ORM
 */
export const categoryRepository = {
  /**
   * Find all categories
   * @returns Array of categories ordered by creation date
   */
  async findAll(): Promise<CategoryResponse[]> {
    return await prisma.category.findMany({
      orderBy: { createdAt: 'asc' },
    });
  },

  /**
   * Find a category by ID
   * @param id - Category ID
   * @returns Category or null if not found
   */
  async findById(id: string): Promise<CategoryResponse | null> {
    return await prisma.category.findUnique({
      where: { id },
    });
  },

  /**
   * Find a category by urlCode
   * @param urlCode - Category URL code
   * @returns Category or null if not found
   */
  async findByUrlCode(
    urlCode: CategoryUrlCode
  ): Promise<CategoryResponse | null> {
    return await prisma.category.findUnique({
      where: { urlCode },
    });
  },

  /**
   * Create a new category
   * @param data - Category data including title and urlCode
   * @returns Created category
   */
  async create(data: {
    title: string;
    urlCode: CategoryUrlCode;
  }): Promise<CategoryResponse> {
    return await prisma.category.create({
      data: {
        title: data.title,
        urlCode: data.urlCode,
      },
    });
  },

  /**
   * Update a category
   * @param id - Category ID
   * @param data - Partial category data to update
   * @returns Updated category
   */
  async update(
    id: string,
    data: Partial<{ title: string; urlCode: CategoryUrlCode }>
  ): Promise<CategoryResponse> {
    return await prisma.category.update({
      where: { id },
      data,
    });
  },

  /**
   * Delete a category
   * @param id - Category ID
   */
  async delete(id: string): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  },

  /**
   * Check if category has associated projects
   * @param id - Category ID
   * @returns True if category has projects, false otherwise
   */
  async hasProjects(id: string): Promise<boolean> {
    const count = await prisma.project.count({
      where: {
        categories: {
          some: { id },
        },
      },
    });
    return count > 0;
  },
};
