import { Request, Response } from 'express';
import { categoryService } from '../services/category.service';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from '@shirans/shared';
import { validateRequest } from '../utils/validation';

/**
 * Get all categories
 * GET /api/categories
 */
export async function getAllCategories(
  _req: Request,
  res: Response
): Promise<Response> {
  const categories = await categoryService.getAllCategories();
  return res.status(200).json(categories);
}

/**
 * Get a category by ID
 * GET /api/categories/:id
 */
export async function getCategoryById(
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = validateRequest(categoryIdSchema, req.params);
  const category = await categoryService.getCategoryById(id);
  return res.status(200).json(category);
}

/**
 * Create a new category
 * POST /api/categories
 * Body: CategoryRequest
 */
export async function createCategory(
  req: Request,
  res: Response
): Promise<Response> {
  const validatedData = validateRequest(createCategorySchema, req.body);
  const category = await categoryService.createCategory(validatedData);
  return res.status(201).json(category);
}

/**
 * Update a category
 * PUT /api/categories/:id
 * Body: Partial<CategoryRequest>
 */
export async function updateCategory(
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = validateRequest(categoryIdSchema, req.params);
  const validatedData = validateRequest(updateCategorySchema, req.body);
  const category = await categoryService.updateCategory(id, validatedData);
  return res.status(200).json(category);
}

/**
 * Delete a category
 * DELETE /api/categories/:id
 */
export async function deleteCategory(
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = validateRequest(categoryIdSchema, req.params);
  await categoryService.deleteCategory(id);
  return res.status(200).json({ message: 'Category deleted successfully' });
}
