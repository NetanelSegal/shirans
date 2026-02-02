import { Request, Response } from 'express';
import { projectService } from '../services/project.service';
import type {
  UpdateProjectInput,
  ImageInput,
  ProjectQueryParams,
} from '../types/project.types';
import { HttpError } from '../middleware/errorHandler';
import type { ProjectFilters } from '../repositories/project.repository';

/**
 * Get all projects with optional filters
 * GET /api/projects?category=xxx&favourite=true&isCompleted=false
 */
export async function getAllProjects(
  req: Request,
  res: Response
): Promise<Response> {
  const query = req.query as ProjectQueryParams;
  const filters: ProjectFilters = {};

  // Parse query parameters
  if (query.category !== undefined) {
    filters.category = query.category;
  }
  if (query.favourite !== undefined) {
    filters.favourite = query.favourite === 'true';
  }
  if (query.isCompleted !== undefined) {
    filters.isCompleted = query.isCompleted === 'true';
  }

  const projects = await projectService.getAllProjects(filters);
  return res.status(200).json(projects);
}

/**
 * Get all favourite projects
 * GET /api/projects/favourites
 */
export async function getFavouriteProjects(
  _req: Request,
  res: Response
): Promise<Response> {
  const projects = await projectService.getFavouriteProjects();
  return res.status(200).json(projects);
}

/**
 * Get a single project by ID
 * GET /api/projects/single?id=xxx
 */
export async function getProjectById(
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    throw new HttpError(400, 'Project ID is required as query parameter');
  }

  const project = await projectService.getProjectById(id);
  return res.status(200).json(project);
}

/**
 * Update an existing project
 * PUT /api/projects
 * Body: { id: string, ...updateData }
 */
export async function updateProject(
  req: Request,
  res: Response
): Promise<Response> {
  const body = req.body as UpdateProjectInput & { id?: string };

  if (!body.id || typeof body.id !== 'string') {
    throw new HttpError(400, 'Project ID is required in request body');
  }

  const { id, ...updateData } = body;

  // Validate categoryIds if provided
  if (updateData.categoryIds !== undefined) {
    if (!Array.isArray(updateData.categoryIds)) {
      throw new HttpError(400, 'categoryIds must be an array');
    }
    if (
      !updateData.categoryIds.every(
        (catId) => typeof catId === 'string' && catId.length > 0
      )
    ) {
      throw new HttpError(400, 'All categoryIds must be non-empty strings');
    }
  }

  const updatedProject = await projectService.updateProject(id, updateData);
  return res.status(200).json(updatedProject);
}

/**
 * Upload images to a project
 * POST /api/projects/uploadImgs
 * Body: { id: string, images: ImageInput[] }
 */
export async function uploadProjectImages(
  req: Request,
  res: Response
): Promise<Response> {
  const body = req.body as { id?: string; images?: unknown };

  if (!body.id || typeof body.id !== 'string') {
    throw new HttpError(400, 'Project ID is required in request body');
  }

  if (!body.images || !Array.isArray(body.images)) {
    throw new HttpError(400, 'Images array is required in request body');
  }

  // Validate image inputs
  const images: ImageInput[] = [];
  for (const img of body.images) {
    if (
      typeof img !== 'object' ||
      img === null ||
      !('url' in img) ||
      !('type' in img)
    ) {
      throw new HttpError(
        400,
        'Each image must have url and type properties'
      );
    }

    const url = img.url;
    const type = img.type;
    const order = 'order' in img ? img.order : undefined;

    if (typeof url !== 'string' || url.length === 0) {
      throw new HttpError(400, 'Image URL must be a non-empty string');
    }

    if (
      typeof type !== 'string' ||
      !['MAIN', 'IMAGE', 'PLAN', 'VIDEO'].includes(type)
    ) {
      throw new HttpError(
        400,
        'Image type must be one of: MAIN, IMAGE, PLAN, VIDEO'
      );
    }

    if (order !== undefined && (typeof order !== 'number' || order < 0)) {
      throw new HttpError(400, 'Image order must be a non-negative number');
    }

    images.push({
      url,
      type: type as ImageInput['type'],
      order,
    });
  }

  const updatedProject = await projectService.uploadProjectImages(
    body.id,
    images
  );
  return res.status(200).json(updatedProject);
}

/**
 * Delete the main image from a project
 * DELETE /api/projects/deleteMainImage
 * Body: { id: string }
 */
export async function deleteMainImage(
  req: Request,
  res: Response
): Promise<Response> {
  const body = req.body as { id?: string };

  if (!body.id || typeof body.id !== 'string') {
    throw new HttpError(400, 'Project ID is required in request body');
  }

  await projectService.deleteMainImage(body.id);
  return res.status(200).json({ message: 'Main image deleted successfully' });
}

/**
 * Delete specific images from a project
 * DELETE /api/projects/deleteImages
 * Body: { id: string, imageIds: string[] }
 */
export async function deleteProjectImages(
  req: Request,
  res: Response
): Promise<Response> {
  const body = req.body as { id?: string; imageIds?: unknown };

  if (!body.id || typeof body.id !== 'string') {
    throw new HttpError(400, 'Project ID is required in request body');
  }

  if (!body.imageIds || !Array.isArray(body.imageIds)) {
    throw new HttpError(400, 'imageIds array is required in request body');
  }

  // Validate image IDs
  const imageIds: string[] = [];
  for (const imgId of body.imageIds) {
    if (typeof imgId !== 'string' || imgId.length === 0) {
      throw new HttpError(400, 'All imageIds must be non-empty strings');
    }
    imageIds.push(imgId);
  }

  await projectService.deleteProjectImages(body.id, imageIds);
  return res.status(200).json({ message: 'Images deleted successfully' });
}
