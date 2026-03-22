import type { Request, Response } from 'express';
import { projectService } from '../services/project.service';
import { projectImageService } from '../services/projectImage.service';
import type { ProjectFilters } from '../repositories/project.repository';
import {
  createProjectSchema,
  updateProjectSchema,
  projectQuerySchema,
  singleProjectQuerySchema,
  deleteProjectSchema,
  deleteMainImageSchema,
  deleteImagesSchema,
  reorderImagesSchema,
} from '@shirans/shared';
import { validateRequest } from '../utils/validation';
import { parseProjectImageUploadRequest } from '../utils/parseProjectImageUploadRequest';

/**
 * Create a new project
 * POST /api/projects
 * Body: CreateProjectInput
 */
export async function createProject(
  req: Request,
  res: Response
): Promise<Response> {
  const validatedData = validateRequest(createProjectSchema, req.body);
  const project = await projectService.createProject(validatedData);
  return res.status(201).json(project);
}

/**
 * Get all projects with optional filters
 * GET /api/projects?category=xxx&favourite=true&isCompleted=false
 */
export async function getAllProjects(
  req: Request,
  res: Response
): Promise<Response> {
  const query = validateRequest(projectQuerySchema, req.query);
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
  const { id } = validateRequest(singleProjectQuerySchema, req.query);
  const project = await projectService.getProjectById(id);
  return res.status(200).json(project);
}

/**
 * Update an existing project
 * PUT /api/projects
 * Body: UpdateProjectInput (includes id)
 */
export async function updateProject(
  req: Request,
  res: Response
): Promise<Response> {
  const validatedData = validateRequest(updateProjectSchema, req.body);
  const { id, ...updateData } = validatedData;
  const updatedProject = await projectService.updateProject(id, updateData);
  return res.status(200).json(updatedProject);
}

/**
 * Upload images to a project via multipart/form-data.
 * Fields: files (binary), id (string), metadata (JSON array of {type, order?}).
 */
export async function uploadProjectImages(
  req: Request,
  res: Response
): Promise<Response> {
  const { id, files, metadata } = parseProjectImageUploadRequest(req);
  const updatedProject = await projectImageService.uploadProjectImages(
    id,
    files,
    metadata,
  );
  return res.status(200).json(updatedProject);
}

/**
 * Delete a project
 * DELETE /api/projects
 * Body: DeleteProjectInput
 */
export async function deleteProject(
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = validateRequest(deleteProjectSchema, req.body);
  await projectService.deleteProject(id);
  return res.status(200).json({ message: 'Project deleted successfully' });
}

/**
 * Delete the main image from a project
 * DELETE /api/projects/deleteMainImage
 * Body: DeleteMainImageInput
 */
export async function deleteMainImage(
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = validateRequest(deleteMainImageSchema, req.body);
  await projectImageService.deleteMainImage(id);
  return res.status(200).json({ message: 'Main image deleted successfully' });
}

/**
 * Delete specific images from a project
 * DELETE /api/projects/deleteImages
 * Body: DeleteImagesInput
 */
export async function deleteProjectImages(
  req: Request,
  res: Response
): Promise<Response> {
  const { id, imageIds } = validateRequest(deleteImagesSchema, req.body);
  await projectImageService.deleteProjectImages(id, imageIds);
  return res.status(200).json({ message: 'Images deleted successfully' });
}

/**
 * Reorder images within a project.
 * PATCH /api/projects/reorderImages
 * Body: { id, imageIds } — imageIds in desired order.
 */
export async function reorderProjectImages(
  req: Request,
  res: Response
): Promise<Response> {
  const { id, imageIds } = validateRequest(reorderImagesSchema, req.body);
  const updatedProject = await projectImageService.reorderImages(id, imageIds);
  return res.status(200).json(updatedProject);
}
