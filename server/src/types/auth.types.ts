import type { UserRole } from '@prisma/client';

/**
 * JWT Token payload structure
 */
export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

/**
 * User response (without password)
 */
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Re-export types from validators as single source of truth
export type { RegisterInput, LoginInput } from '@shirans/shared';
export type { RefreshTokenInput } from '../validators/auth.validators';

/**
 * Auth response (user + access token + refresh token)
 * Note: refreshToken is included here for service layer use, but controllers
 * set it in httpOnly cookie instead of returning it in JSON response
 */
export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

/**
 * Refresh token response (new access token + refresh token)
 * Note: refreshToken is included here for service layer use, but controllers
 * set it in httpOnly cookie instead of returning it in JSON response
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
