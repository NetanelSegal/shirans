import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';
import { REFRESH_TOKEN_MAX_LENGTH } from '../constants/auth.constants';

/**
 * Zod schema for user registration
 */
export const registerSchema = z.object({
  email: z
    .preprocess((val) => {
      if (typeof val === 'string') {
        return DOMPurify.sanitize(val.trim());
      }
      return val;
    }, z.string().email('Invalid email format').min(1, 'Email is required').max(255, 'Email must be less than 255 characters')),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character'
    ),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .transform((val) => DOMPurify.sanitize(val.trim())),
});

/**
 * Zod schema for user login
 * Note: Password validation is intentionally more lenient than registration.
 * Users already registered with complex passwords, so login only checks minimum length.
 * This prevents user lockout if password complexity requirements change over time.
 */
export const loginSchema = z.object({
  email: z
    .preprocess((val) => {
      if (typeof val === 'string') {
        return DOMPurify.sanitize(val.trim());
      }
      return val;
    }, z.string().email('Invalid email format').min(1, 'Email is required')),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

/**
 * Zod schema for refresh token request (deprecated - now read from cookie)
 * Kept for backward compatibility if needed, but refresh/logout endpoints
 * now read refreshToken from httpOnly cookie instead of request body
 */
export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, 'Refresh token is required')
    .max(REFRESH_TOKEN_MAX_LENGTH, 'Refresh token is too long'),
});

// Type exports for use in controllers
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
