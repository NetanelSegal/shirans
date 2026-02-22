import { prisma } from '../config/database';
import type { Prisma } from '@prisma/client';
import type { ProjectImageType } from '@prisma/client';

/**
 * Filter options for finding projects
 */
export interface ProjectFilters {
  category?: string;
  favourite?: boolean;
  isCompleted?: boolean;
}

/**
 * Project with relations included
 */
type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: {
    categories: true;
    images: {
      orderBy: {
        order: 'asc';
      };
    };
  };
}>;

/**
 * Project Repository
 * Handles all database access for Projects using Prisma ORM
 */
export const projectRepository = {
  /**
   * Retrieve all projects with optional filtering
   * @param filters - Optional filters for category, favourite, and isCompleted
   * @returns Array of projects with categories and images (ordered by image order)
   */
  async findAll(filters?: ProjectFilters): Promise<ProjectWithRelations[]> {
    const where: Prisma.ProjectWhereInput = {};

    if (filters?.category !== undefined) {
      where.categories = {
        some: {
          id: filters.category,
        },
      };
    }

    if (filters?.favourite !== undefined) {
      where.favourite = filters.favourite;
    }

    if (filters?.isCompleted !== undefined) {
      where.isCompleted = filters.isCompleted;
    }

    return await prisma.project.findMany({
      where,
      include: {
        categories: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  },

  /**
   * Retrieve a single project by ID
   * @param id - Project ID
   * @returns Project with categories and images (ordered by image order), or null if not found
   */
  async findById(id: string): Promise<ProjectWithRelations | null> {
    return await prisma.project.findUnique({
      where: { id },
      include: {
        categories: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  },

  /**
   * Create a new project
   * @param data - Project data including category relations
   * @returns Created project with relations
   */
  async create(data: Prisma.ProjectCreateInput): Promise<ProjectWithRelations> {
    return await prisma.project.create({
      data,
      include: {
        categories: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  },

  /**
   * Update an existing project
   * @param id - Project ID
   * @param data - Project update data including category relations
   * @returns Updated project with relations
   */
  async update(
    id: string,
    data: Prisma.ProjectUpdateInput
  ): Promise<ProjectWithRelations> {
    return await prisma.project.update({
      where: { id },
      data,
      include: {
        categories: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  },

  /**
   * Delete a project
   * @param id - Project ID
   * @returns Deleted project (cascade delete handled by Prisma schema)
   */
  async delete(id: string): Promise<ProjectWithRelations> {
    return await prisma.project.delete({
      where: { id },
      include: {
        categories: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  },

  /**
   * Add images to a project
   * @param projectId - Project ID
   * @param images - Array of image data
   */
  async addImages(
    projectId: string,
    images: Array<{ url: string; type: ProjectImageType; order?: number }>,
  ): Promise<void> {
    await prisma.projectImage.createMany({
      data: images.map((img) => ({
        url: img.url,
        type: img.type,
        order: img.order ?? 0,
        projectId,
      })),
    });
  },

  /**
   * Delete a single image by ID
   * @param imageId - Image ID
   */
  async deleteImage(imageId: string): Promise<void> {
    await prisma.projectImage.delete({
      where: { id: imageId },
    });
  },

  /**
   * Delete multiple images from a project
   * @param projectId - Project ID
   * @param imageIds - Array of image IDs to delete
   */
  async deleteImages(
    projectId: string,
    imageIds: string[],
  ): Promise<void> {
    await prisma.projectImage.deleteMany({
      where: {
        id: { in: imageIds },
        projectId,
      },
    });
  },
};
