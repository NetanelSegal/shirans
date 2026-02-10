import jwt from 'jsonwebtoken';
import { env } from './env';
import type { TokenPayload } from '../types/auth.types';

// Re-export TokenPayload for convenience
export type { TokenPayload } from '../types/auth.types';

/**
 * Sign a JWT access token with user information
 * @param payload - User information to include in token
 * @returns Signed JWT token
 */
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    return decoded;
  } catch {
    // Generic error message to prevent information disclosure
    throw new Error('Invalid or expired token');
  }
}

/**
 * Decode a JWT token without verification (for debugging only)
 * @param token - JWT token to decode
 * @returns Decoded token payload or null if invalid
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.decode(token) as TokenPayload | null;
    return decoded;
  } catch {
    return null;
  }
}
