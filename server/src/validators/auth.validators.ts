import { z } from 'zod';
import { REFRESH_TOKEN_MAX_LENGTH } from '@shirans/shared';

/**
 * Zod schema for refresh token request (deprecated - now read from cookie)
 * Kept for backward compatibility if needed, but refresh/logout endpoints
 * now read refreshToken from httpOnly cookie instead of request body
 */
export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, 'Refresh token is required')
    .max(REFRESH_TOKEN_MAX_LENGTH, 'Refresh token is too long'),
});

// Type exports for use in controllers
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
