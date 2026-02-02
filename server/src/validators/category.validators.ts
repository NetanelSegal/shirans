import { z } from 'zod';
import { CategoryUrlCode } from '@prisma/client';

/**
 * Zod schema for creating a category
 */
export const createCategorySchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be less than 100 characters'),
  urlCode: z.nativeEnum(CategoryUrlCode).superRefine((val, ctx) => {
    if (!Object.values(CategoryUrlCode).includes(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid category URL code',
      });
    }
  }),
});

/**
 * Zod schema for updating a category
 */
export const updateCategorySchema = z.object({
  title: z.string().min(2).max(100).optional(),
  urlCode: z.nativeEnum(CategoryUrlCode).optional(),
});

/**
 * Zod schema for category ID parameter
 */
export const categoryIdSchema = z.object({
  id: z.string().cuid('Category ID must be a valid CUID'),
});
