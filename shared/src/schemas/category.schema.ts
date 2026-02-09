import { z } from 'zod';

const categoryUrlCode = z.enum(['privateHouses', 'apartments', 'publicSpaces']);

/**
 * Zod schema for creating a category
 */
export const createCategorySchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be less than 100 characters'),
  urlCode: categoryUrlCode,
});

/**
 * Zod schema for updating a category
 */
export const updateCategorySchema = z.object({
  title: z.string().min(2).max(100).optional(),
  urlCode: categoryUrlCode.optional(),
});

/**
 * Zod schema for category ID parameter
 */
export const categoryIdSchema = z.object({
  id: z.cuid('Category ID must be a valid CUID'),
});

// Type exports
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryIdInput = z.infer<typeof categoryIdSchema>;
