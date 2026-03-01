import {
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
} from '../constants/auth.constants';
import {
  LEAD_RATE_LIMIT_MAX_REQUESTS,
  LEAD_RATE_LIMIT_WINDOW_MS,
  ADMIN_MUTATION_MAX_REQUESTS,
  ADMIN_MUTATION_WINDOW_MS,
} from '../constants/rateLimit.constants';
import { env } from '../utils/env';
import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for authentication endpoints
 * Prevents brute-force attacks on login/registration
 */
export const authLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'test',
});

/**
 * Rate limiter for public lead capture (contact form, calculator leads)
 * Strict: 10 requests per 15 minutes per IP
 */
export const leadLimiter = rateLimit({
  windowMs: LEAD_RATE_LIMIT_WINDOW_MS,
  max: LEAD_RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many submissions, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'test',
});

/**
 * Rate limiter for admin mutation endpoints (CRUD, uploads)
 * Moderate: 100 requests per 15 minutes per IP
 */
export const adminMutationLimiter = rateLimit({
  windowMs: ADMIN_MUTATION_WINDOW_MS,
  max: ADMIN_MUTATION_MAX_REQUESTS,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'test',
});
