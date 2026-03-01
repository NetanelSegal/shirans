/**
 * Rate limiting constants for various endpoint categories
 */

/** Lead capture (contact, calculator) — strict: 10 requests per 15 min per IP */
export const LEAD_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const LEAD_RATE_LIMIT_MAX_REQUESTS = 10;

/** Admin mutation (CRUD, uploads) — moderate: 100 requests per 15 min per IP */
export const ADMIN_MUTATION_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const ADMIN_MUTATION_MAX_REQUESTS = 100;
