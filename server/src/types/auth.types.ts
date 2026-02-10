import type { UserRole, UserResponse } from '@shirans/shared';

/**
 * JWT Token payload structure
 */
export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// Re-export types from validators as single source of truth
export type { RegisterInput, LoginInput } from '@shirans/shared';
export type { RefreshTokenInput } from '../validators/auth.validators';

// Re-export shared types for convenience
export type { UserResponse } from '@shirans/shared';

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
