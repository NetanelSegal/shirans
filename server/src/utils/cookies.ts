import { Request, Response } from 'express';
import { env } from './env';

const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

/**
 * Set refresh token in httpOnly cookie
 * @param res - Express response object
 * @param token - Refresh token string
 * @param maxAge - Cookie max age in milliseconds
 */
export function setRefreshTokenCookie(
  res: Response,
  token: string,
  maxAge: number
): void {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true, // Prevents JavaScript access (XSS protection)
    secure: env.COOKIE_SECURE === 'true' || env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: (env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none') || 'strict', // CSRF protection
    maxAge,
    path: '/api/auth', // Only sent to auth endpoints
    domain: env.COOKIE_DOMAIN || undefined,
  });
}

/**
 * Clear refresh token cookie
 * @param res - Express response object
 */
export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: env.COOKIE_SECURE === 'true' || env.NODE_ENV === 'production',
    sameSite: (env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none') || 'strict',
    path: '/api/auth',
    domain: env.COOKIE_DOMAIN || undefined,
  });
}

/**
 * Get refresh token from cookie
 * @param req - Express request object
 * @returns Refresh token string or null if not found
 */
export function getRefreshTokenFromCookie(req: Request): string | null {
  return (req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] as string) || null;
}
