import { z } from 'zod';

export const createTestimonialSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message cannot exceed 2000 characters'),
  isPublished: z.boolean().default(false).optional(),
  order: z.number().int().nonnegative('Order must be a non-negative integer').optional().default(0),
});

export const updateTestimonialSchema = createTestimonialSchema.partial().extend({
  id: z.string().cuid('Invalid testimonial ID format'),
});

export const testimonialIdSchema = z.object({
  id: z.string().cuid('Invalid testimonial ID format'),
});

export const testimonialQuerySchema = z.object({
  isPublished: z.enum(['true', 'false']).optional(),
});

export const updateOrderSchema = z.object({
  id: z.string().cuid('Invalid testimonial ID format'),
  order: z.number().int().nonnegative('Order must be a non-negative integer'),
});

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
export type TestimonialIdInput = z.infer<typeof testimonialIdSchema>;
export type TestimonialQueryInput = z.infer<typeof testimonialQuerySchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
