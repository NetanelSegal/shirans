import { prisma } from '../config/database';
import type { CategoryResponse } from '@shirans/shared';

function transformCategory(category: {
  id: string;
  title: string;
  urlCode: string;
  createdAt: Date;
  updatedAt: Date;
}): CategoryResponse {
  return {
    id: category.id,
    title: category.title,
    urlCode: category.urlCode,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

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
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return categories.map(transformCategory);
  },

  /**
   * Find a category by ID
   * @param id - Category ID
   * @returns Category or null if not found
   */
  async findById(id: string): Promise<CategoryResponse | null> {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    return category ? transformCategory(category) : null;
  },

  /**
   * Find a category by urlCode
   * @param urlCode - Category URL code
   * @returns Category or null if not found
   */
  async findByUrlCode(
    urlCode: string
  ): Promise<CategoryResponse | null> {
    const category = await prisma.category.findUnique({
      where: { urlCode },
    });
    return category ? transformCategory(category) : null;
  },

  /**
   * Create a new category
   * @param data - Category data including title and urlCode
   * @returns Created category
   */
  async create(data: {
    title: string;
    urlCode: string;
  }): Promise<CategoryResponse> {
    const category = await prisma.category.create({
      data: {
        title: data.title,
        urlCode: data.urlCode,
      },
    });
    return transformCategory(category);
  },

  /**
   * Update a category
   * @param id - Category ID
   * @param data - Partial category data to update
   * @returns Updated category
   */
  async update(
    id: string,
    data: Partial<{ title: string; urlCode: string }>
  ): Promise<CategoryResponse> {
    const category = await prisma.category.update({
      where: { id },
      data,
    });
    return transformCategory(category);
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
