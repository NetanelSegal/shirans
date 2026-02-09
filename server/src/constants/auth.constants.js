"use strict";
/**
 * Authentication-related constants
 * Centralized location for magic numbers and configuration values
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET_MIN_LENGTH = exports.REFRESH_TOKEN_MAX_LENGTH = exports.RATE_LIMIT_MAX_REQUESTS = exports.RATE_LIMIT_WINDOW_MS = exports.REFRESH_TOKEN_BYTE_LENGTH = void 0;
/**
 * Number of random bytes to generate for refresh tokens
 * 32 bytes = 64 hex characters = 256 bits of entropy
 */
exports.REFRESH_TOKEN_BYTE_LENGTH = 32;
/**
 * Rate limiting configuration for authentication endpoints
 */
exports.RATE_LIMIT_WINDOW_MS = 0; // 15 minutes
exports.RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per window
/**
 * Refresh token maximum length in characters
 * 64 hex characters (from 32 bytes) = 128 bytes max
 */
exports.REFRESH_TOKEN_MAX_LENGTH = 128;
/**
 * Minimum length for JWT secret key (in characters)
 * 32 characters = 256 bits of entropy (minimum recommended for security)
 */
exports.JWT_SECRET_MIN_LENGTH = 32;
