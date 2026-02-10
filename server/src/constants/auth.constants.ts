/**
 * Authentication-related constants
 * Centralized location for magic numbers and configuration values
 */

/**
 * Number of random bytes to generate for refresh tokens
 * 32 bytes = 64 hex characters = 256 bits of entropy
 */
export const REFRESH_TOKEN_BYTE_LENGTH = 32;

/**
 * Rate limiting configuration for authentication endpoints
 */
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per window

/**
 * Refresh token maximum length in characters
 * 64 hex characters (from 32 bytes) = 128 bytes max
 */
export const REFRESH_TOKEN_MAX_LENGTH = 128;

/**
 * Minimum length for JWT secret key (in characters)
 * 32 characters = 256 bits of entropy (minimum recommended for security)
 */
export const JWT_SECRET_MIN_LENGTH = 32;
