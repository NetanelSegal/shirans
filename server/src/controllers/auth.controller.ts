import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import {
  registerSchema,
  loginSchema,
} from '@shirans/shared';
import { validateRequest } from '../utils/validation';
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getRefreshTokenFromCookie,
} from '../utils/cookies';
import { HttpError } from '../middleware/errorHandler';
import { HTTP_STATUS } from '../constants/httpStatus';
import { ERROR_MESSAGES } from '../constants/errorMessages';
import { env } from '../utils/env';

/**
 * Calculate refresh token max age in milliseconds from JWT_REFRESH_EXPIRES_IN
 */
function calculateRefreshTokenMaxAge(): number {
  const expiresIn = env.JWT_REFRESH_EXPIRES_IN;
  const match = expiresIn.match(/^(\d+)([dhms])$/);
  if (!match) {
    // Default to 7 days if format is invalid
    return 7 * 24 * 60 * 60 * 1000;
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'm':
      return value * 60 * 1000;
    case 's':
      return value * 1000;
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
}

/**
 * Register a new user
 * POST /api/auth/register
 * Body: { email, password, name }
 */
export async function register(req: Request, res: Response): Promise<Response> {
  const validatedData = validateRequest(registerSchema, req.body);
  const result = await authService.register(validatedData);

  // Set refresh token in httpOnly cookie
  const maxAge = calculateRefreshTokenMaxAge();
  setRefreshTokenCookie(res, result.refreshToken, maxAge);

  // Return only user and access token in JSON (refresh token is in cookie)
  return res.status(201).json({
    user: result.user,
    accessToken: result.accessToken,
  });
}

/**
 * Login user
 * POST /api/auth/login
 * Body: { email, password }
 */
export async function login(req: Request, res: Response): Promise<Response> {
  const validatedData = validateRequest(loginSchema, req.body);
  const result = await authService.login(validatedData);

  // Set refresh token in httpOnly cookie
  const maxAge = calculateRefreshTokenMaxAge();
  setRefreshTokenCookie(res, result.refreshToken, maxAge);

  // Return only user and access token in JSON (refresh token is in cookie)
  return res.status(200).json({
    user: result.user,
    accessToken: result.accessToken,
  });
}

/**
 * Get current authenticated user
 * GET /api/auth/me
 * Requires: Authentication (Bearer token)
 * Note: req.user is guaranteed to exist due to authenticate middleware
 */
export async function getCurrentUser(
  req: Request,
  res: Response
): Promise<Response> {
  // req.user is guaranteed to exist because authenticate middleware runs before this
  const user = await authService.getCurrentUser(req.user!.userId);
  return res.status(200).json({ user });
}

/**
 * Refresh access token
 * POST /api/auth/refresh
 * Cookie: refreshToken (httpOnly)
 */
export async function refresh(req: Request, res: Response): Promise<Response> {
  // Read refresh token from cookie instead of request body
  const refreshToken = getRefreshTokenFromCookie(req);
  if (!refreshToken) {
    throw new HttpError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_MESSAGES.AUTH.REFRESH_TOKEN_REQUIRED
    );
  }

  const result = await authService.refreshAccessToken(refreshToken);

  // Set new refresh token in httpOnly cookie
  const maxAge = calculateRefreshTokenMaxAge();
  setRefreshTokenCookie(res, result.refreshToken, maxAge);

  // Return only access token in JSON (refresh token is in cookie)
  return res.status(200).json({
    accessToken: result.accessToken,
  });
}

/**
 * Logout user (server-side token invalidation)
 * POST /api/auth/logout
 * Cookie: refreshToken (httpOnly)
 *
 * Revokes the refresh token server-side, preventing further use.
 * Access tokens will expire naturally based on their expiration time.
 */
export async function logout(req: Request, res: Response): Promise<Response> {
  // Read refresh token from cookie instead of request body
  const refreshToken = getRefreshTokenFromCookie(req);
  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  // Clear refresh token cookie
  clearRefreshTokenCookie(res);

  return res.status(200).json({ message: 'Logged out successfully' });
}
