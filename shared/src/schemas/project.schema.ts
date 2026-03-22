import { z } from 'zod';
import {
  PROJECT_IMAGE_TYPE_VALUES,
  PROJECT_IMAGE_TYPES_UPLOADABLE,
} from '../constants/projectImage';

const projectImageTypeSchema = z.enum(PROJECT_IMAGE_TYPE_VALUES, {
  message: 'Image type must be one of: MAIN, IMAGE, PLAN, VIDEO',
});

const multipartProjectImageTypeSchema = z.enum(PROJECT_IMAGE_TYPES_UPLOADABLE, {
  message: 'Multipart upload type must be one of: MAIN, IMAGE, PLAN',
});

/**
 * Zod schema for project image input
 */
export const imageInputSchema = z.object({
  url: z.url('Image URL must be a valid URL').min(1, 'Image URL is required'),
  type: projectImageTypeSchema,
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
    .array(z.cuid('Category ID must be a valid CUID'))
    .min(1, 'At least one category is required'),
  images: z.array(imageInputSchema).optional().default([]),
});

/**
 * Zod schema for updating a project
 */
export const updateProjectSchema = z.object({
  id: z.cuid('Project ID must be a valid CUID'),
  title: z.string().min(1).max(500).optional(),
  description: z.string().min(1).optional(),
  location: z.string().min(1).max(200).optional(),
  client: z.string().min(1).max(200).optional(),
  isCompleted: z.boolean().optional(),
  constructionArea: z.number().int().positive().optional(),
  favourite: z.boolean().optional(),
  categoryIds: z.array(z.cuid()).optional(),
});

/**
 * Zod schema for project query parameters
 */
export const projectQuerySchema = z.object({
  category: z.cuid().optional(),
  favourite: z.enum(['true', 'false']).optional(),
  isCompleted: z.enum(['true', 'false']).optional(),
});

/**
 * Zod schema for single project query
 */
export const singleProjectQuerySchema = z.object({
  id: z.cuid('Project ID must be a valid CUID'),
});

/**
 * Zod schema for uploading project images
 */
export const uploadImagesSchema = z.object({
  id: z.cuid('Project ID must be a valid CUID'),
  images: z.array(imageInputSchema).min(1, 'At least one image is required'),
});

/**
 * Zod schema for deleting main image
 */
export const deleteMainImageSchema = z.object({
  id: z.cuid('Project ID must be a valid CUID'),
});

/**
 * Zod schema for deleting a project
 */
export const deleteProjectSchema = z.object({
  id: z.cuid('Project ID must be a valid CUID'),
});

/**
 * Zod schema for deleting project images
 */
export const deleteImagesSchema = z.object({
  id: z.cuid('Project ID must be a valid CUID'),
  imageIds: z
    .array(z.cuid('Image ID must be a valid CUID'))
    .min(1, 'At least one image ID is required'),
});

/**
 * Zod schema for reordering project images.
 * imageIds is the full ordered list — position in the array becomes the new order value.
 * The service also requires imageIds.length === project.images.length (see project.service).
 */
export const reorderImagesSchema = z
  .object({
    id: z.cuid('Project ID must be a valid CUID'),
    imageIds: z
      .array(z.cuid('Image ID must be a valid CUID'))
      .min(1, 'At least one image ID is required'),
  })
  .refine((data) => new Set(data.imageIds).size === data.imageIds.length, {
    message: 'Image IDs must be unique',
    path: ['imageIds'],
  });

/**
 * Zod schema for multipart upload metadata (parsed from the JSON metadata field).
 * VIDEO is only for external URLs via create/update project payloads, not file upload.
 */
export const uploadImageMetadataSchema = z.object({
  type: multipartProjectImageTypeSchema,
  order: z.number().int().nonnegative().optional(),
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
export type ReorderImagesInput = z.infer<typeof reorderImagesSchema>;
export type UploadImageMetadata = z.infer<typeof uploadImageMetadataSchema>;
