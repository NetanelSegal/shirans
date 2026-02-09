import { z } from 'zod';

/**
 * Zod schema for project image input
 */
export const imageInputSchema = z.object({
  url: z.url('Image URL must be a valid URL').min(1, 'Image URL is required'),
  type: z.enum(['MAIN', 'IMAGE', 'PLAN', 'VIDEO'], {
    message: 'Image type must be one of: MAIN, IMAGE, PLAN, VIDEO',
  }),
  order: z.number().int().nonnegative().optional(),
});

/**
 * Zod schema for creating a project
 */
export const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(500, 'Title must be less than 500 characters'),
  description: z.string().min(1, 'Description is required'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(200, 'Location must be less than 200 characters'),
  client: z
    .string()
    .min(1, 'Client is required')
    .max(200, 'Client must be less than 200 characters'),
  isCompleted: z.boolean().optional().default(false),
  constructionArea: z
    .number()
    .int()
    .positive('Construction area must be a positive number'),
  favourite: z.boolean().optional().default(false),
  categoryIds: z
    .array(z.string().cuid('Category ID must be a valid CUID'))
    .min(1, 'At least one category is required'),
  images: z.array(imageInputSchema).optional().default([]),
});

/**
 * Zod schema for updating a project
 */
export const updateProjectSchema = z.object({
  id: z.string().cuid('Project ID must be a valid CUID'),
  title: z.string().min(1).max(500).optional(),
  description: z.string().min(1).optional(),
  location: z.string().min(1).max(200).optional(),
  client: z.string().min(1).max(200).optional(),
  isCompleted: z.boolean().optional(),
  constructionArea: z.number().int().positive().optional(),
  favourite: z.boolean().optional(),
  categoryIds: z.array(z.string().cuid()).optional(),
});

/**
 * Zod schema for project query parameters
 */
export const projectQuerySchema = z.object({
  category: z.string().cuid().optional(),
  favourite: z.enum(['true', 'false']).optional(),
  isCompleted: z.enum(['true', 'false']).optional(),
});

/**
 * Zod schema for single project query
 */
export const singleProjectQuerySchema = z.object({
  id: z.string().cuid('Project ID must be a valid CUID'),
});

/**
 * Zod schema for uploading project images
 */
export const uploadImagesSchema = z.object({
  id: z.string().cuid('Project ID must be a valid CUID'),
  images: z.array(imageInputSchema).min(1, 'At least one image is required'),
});

/**
 * Zod schema for deleting main image
 */
export const deleteMainImageSchema = z.object({
  id: z.string().cuid('Project ID must be a valid CUID'),
});

/**
 * Zod schema for deleting a project
 */
export const deleteProjectSchema = z.object({
  id: z.string().cuid('Project ID must be a valid CUID'),
});

/**
 * Zod schema for deleting project images
 */
export const deleteImagesSchema = z.object({
  id: z.string().cuid('Project ID must be a valid CUID'),
  imageIds: z
    .array(z.string().cuid('Image ID must be a valid CUID'))
    .min(1, 'At least one image ID is required'),
});

// Type exports for use in controllers
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectQueryInput = z.infer<typeof projectQuerySchema>;
export type SingleProjectQueryInput = z.infer<typeof singleProjectQuerySchema>;
export type UploadImagesInput = z.infer<typeof uploadImagesSchema>;
export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>;
export type DeleteMainImageInput = z.infer<typeof deleteMainImageSchema>;
export type DeleteImagesInput = z.infer<typeof deleteImagesSchema>;
