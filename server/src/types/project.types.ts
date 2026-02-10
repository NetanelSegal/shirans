import type { Prisma } from '@prisma/client';
import type { CategoryUrlCode } from '@prisma/client';

/**
 * ResponsiveImage interface matching frontend format
 */
export interface ResponsiveImage {
  mobile?: string;
  tablet?: string;
  desktop: string;
  fallback?: string;
}

/**
 * Project response matching frontend IProject interface
 */
export interface ProjectResponse {
  id: string;
  title: string;
  categories: CategoryUrlCode[];
  description: string;
  mainImage: string | ResponsiveImage;
  images: (string | ResponsiveImage)[];
  plans?: (string | ResponsiveImage)[];
  videos?: string[];
  location: string;
  client: string;
  isCompleted: boolean;
  constructionArea: number;
  favourite: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Project with relations from Prisma
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
 * Input for updating a project
 */
export interface UpdateProjectInput {
  title?: string;
  description?: string;
  location?: string;
  client?: string;
  isCompleted?: boolean;
  constructionArea?: number;
  favourite?: boolean;
  categoryIds?: string[];
}

/**
 * Input for uploading project images
 */
export interface ImageInput {
  url: string;
  type: 'MAIN' | 'IMAGE' | 'PLAN' | 'VIDEO';
  order?: number;
}

/**
 * Query parameters for filtering projects
 */
export interface ProjectQueryParams {
  category?: string;
  favourite?: string;
  isCompleted?: string;
}

/**
 * Transform Prisma project model to frontend IProject format
 * @param project - Project with relations from Prisma
 * @returns ProjectResponse matching frontend IProject interface
 */
export function transformProjectToResponse(
  project: ProjectWithRelations
): ProjectResponse {
  // Extract main image (type MAIN)
  const mainImageObj = project.images.find((img) => img.type === 'MAIN');
  const mainImage: string | ResponsiveImage = mainImageObj
    ? mainImageObj.url
    : '';

  // Separate images by type
  const regularImages = project.images
    .filter((img) => img.type === 'IMAGE')
    .map((img) => img.url);

  const planImages = project.images
    .filter((img) => img.type === 'PLAN')
    .map((img) => img.url);

  const videoUrls = project.images
    .filter((img) => img.type === 'VIDEO')
    .map((img) => img.url);

  // Extract category URL codes
  const categories: CategoryUrlCode[] = project.categories.map(
    (cat) => cat.urlCode
  );

  return {
    id: project.id,
    title: project.title,
    categories,
    description: project.description,
    mainImage,
    images: regularImages,
    plans: planImages.length > 0 ? planImages : undefined,
    videos: videoUrls.length > 0 ? videoUrls : undefined,
    location: project.location,
    client: project.client,
    isCompleted: project.isCompleted,
    constructionArea: project.constructionArea,
    favourite: project.favourite,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

/**
 * Transform array of Prisma projects to frontend format
 * @param projects - Array of projects with relations from Prisma
 * @returns Array of ProjectResponse
 */
export function transformProjectsToResponse(
  projects: ProjectWithRelations[]
): ProjectResponse[] {
  return projects.map(transformProjectToResponse);
}
