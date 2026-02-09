/**
 * Authentication-related constants
 * Centralized location for magic numbers and configuration values
 */
/**
 * Number of random bytes to generate for refresh tokens
 * 32 bytes = 64 hex characters = 256 bits of entropy
 */
export declare const REFRESH_TOKEN_BYTE_LENGTH = 32;
/**
 * Rate limiting configuration for authentication endpoints
 */
export declare const RATE_LIMIT_WINDOW_MS = 0;
export declare const RATE_LIMIT_MAX_REQUESTS = 5;
/**
 * Refresh token maximum length in characters
 * 64 hex characters (from 32 bytes) = 128 bytes max
 */
export declare const REFRESH_TOKEN_MAX_LENGTH = 128;
/**
 * Minimum length for JWT secret key (in characters)
 * 32 characters = 256 bits of entropy (minimum recommended for security)
 */
export declare const JWT_SECRET_MIN_LENGTH = 32;
//# sourceMappingURL=auth.constants.d.ts.map