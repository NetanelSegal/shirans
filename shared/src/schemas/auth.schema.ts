import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

/**
 * Zod schema for user registration
 */
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .max(255, 'Email must be less than 255 characters')
    .transform((val) => DOMPurify.sanitize(val.trim())),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character',
    ),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .transform((val) => DOMPurify.sanitize(val.trim())),
});

/**
 * Zod schema for user login
 */
export const loginSchema = z.object({
  email: z
    .email('Invalid email format')
    .min(1, 'Email is required')
    .transform((val) => DOMPurify.sanitize(val.trim())),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

// Type exports for use in controllers
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
