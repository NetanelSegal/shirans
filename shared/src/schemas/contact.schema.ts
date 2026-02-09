import { z } from 'zod';

/**
 * Zod schema for submitting a contact form
 */
export const createContactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.email('Invalid email address'),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
  message: z
    .string()
    .max(2000, 'Message must be less than 2000 characters')
    .optional(),
});

/**
 * Zod schema for contact ID parameter
 */
export const contactIdSchema = z.object({
  id: z.string().cuid('Contact ID must be a valid CUID'),
});

/**
 * Zod schema for updating read status
 */
export const updateReadStatusSchema = z.object({
  isRead: z.boolean(),
});

// Type exports
export type CreateContactInput = z.infer<typeof createContactSchema>;
export type ContactIdInput = z.infer<typeof contactIdSchema>;
export type UpdateReadStatusInput = z.infer<typeof updateReadStatusSchema>;
