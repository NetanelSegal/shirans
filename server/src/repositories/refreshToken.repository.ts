import { prisma } from '../config/database';
import crypto from 'crypto';
import { REFRESH_TOKEN_BYTE_LENGTH } from '@shirans/shared';
import { HttpError } from '../middleware/errorHandler';
import { HTTP_STATUS } from '../constants/httpStatus';
import { ERROR_MESSAGES } from '../constants/errorMessages';
import { Prisma } from '@prisma/client';
import type { UserRole } from '@prisma/client';

/**
 * RefreshToken with all fields
 */
type RefreshToken = {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt: Date | null;
};

/**
 * RefreshToken with user relation
 */
type RefreshTokenWithUser = RefreshToken & {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

/**
 * Refresh Token Repository
 * Handles all database access for RefreshTokens using Prisma ORM
 */
export const refreshTokenRepository = {
  /**
   * Create a new refresh token
   * @param userId - User ID
   * @param expiresAt - Token expiration date
   * @returns Created refresh token
   * @throws HttpError if database operation fails
   */
  async create(userId: string, expiresAt: Date): Promise<RefreshToken> {
    try {
      // Generate a secure random token
      const token = crypto
        .randomBytes(REFRESH_TOKEN_BYTE_LENGTH)
        .toString('hex');

      return await prisma.refreshToken.create({
        data: {
          token,
          userId,
          expiresAt,
        },
      });
    } catch (error) {
      // Handle Prisma errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Unique constraint violation (shouldn't happen with random tokens, but handle it)
          throw new HttpError(
            HTTP_STATUS.CONFLICT,
            'Token already exists - please try again'
          );
        }
        if (error.code === 'P2003') {
          // Foreign key constraint violation (user doesn't exist)
          throw new HttpError(
            HTTP_STATUS.NOT_FOUND,
            ERROR_MESSAGES.NOT_FOUND.USER_NOT_FOUND
          );
        }
      }
      // Generic database error
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Failed to create refresh token'
      );
    }
  },

  /**
   * Find a refresh token by token string with user relation
   * @param token - Refresh token string
   * @returns Refresh token with user or null if not found
   */
  async findByToken(token: string): Promise<RefreshTokenWithUser | null> {
    return (await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    })) as RefreshTokenWithUser | null;
  },

  /**
   * Find a refresh token by token string (without user relation)
   * @param token - Refresh token string
   * @returns Refresh token or null if not found
   */
  async findByTokenOnly(token: string): Promise<RefreshToken | null> {
    return await prisma.refreshToken.findUnique({
      where: { token },
    });
  },

  /**
   * Revoke a refresh token
   * @param token - Refresh token string
   * @returns Updated refresh token
   * @throws HttpError if token not found or database operation fails
   */
  async revoke(token: string): Promise<RefreshToken> {
    try {
      return await prisma.refreshToken.update({
        where: { token },
        data: { revokedAt: new Date() },
      });
    } catch (error) {
      // Handle Prisma errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          // Record not found
          throw new HttpError(
            HTTP_STATUS.NOT_FOUND,
            ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID
          );
        }
      }
      // Generic database error
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Failed to revoke refresh token'
      );
    }
  },

  /**
   * Revoke all refresh tokens for a user
   * @param userId - User ID
   * @returns Number of revoked tokens
   */
  async revokeAllForUser(userId: string): Promise<number> {
    const result = await prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
    return result.count;
  },

  /**
   * Delete expired refresh tokens
   * @param beforeDate - Delete tokens expired before this date (default: now)
   * @returns Number of deleted tokens
   */
  async deleteExpired(beforeDate: Date = new Date()): Promise<number> {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: beforeDate,
        },
      },
    });
    return result.count;
  },

  /**
   * Check if token is valid (exists, not expired, not revoked)
   * @param token - Refresh token string
   * @returns True if token is valid, false otherwise
   */
  async isValid(token: string): Promise<boolean> {
    const refreshToken = await this.findByTokenOnly(token);
    if (!refreshToken) {
      return false;
    }
    if (refreshToken.revokedAt) {
      return false;
    }
    if (refreshToken.expiresAt < new Date()) {
      return false;
    }
    return true;
  },

  /**
   * Atomically find and revoke a refresh token
   * Uses a database transaction to prevent race conditions where
   * multiple requests could use the same token before revocation
   * @param token - Refresh token string
   * @returns Refresh token with user relation if valid and successfully revoked
   * @throws HttpError if token is invalid, expired, or already revoked
   */
  async findAndRevokeToken(token: string): Promise<RefreshTokenWithUser> {
    const now = new Date();

    try {
      // Use transaction to atomically find and revoke
      const result = await prisma.$transaction(async (tx) => {
        // Find token with user relation
        const refreshToken = await tx.refreshToken.findUnique({
          where: { token },
          include: { user: true },
        });

        // Check if token exists
        if (!refreshToken) {
          throw new HttpError(
            HTTP_STATUS.UNAUTHORIZED,
            ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID
          );
        }

        // Check if already revoked (reuse detection)
        if (refreshToken.revokedAt) {
          throw new HttpError(
            HTTP_STATUS.UNAUTHORIZED,
            ERROR_MESSAGES.AUTH.TOKEN_REUSE_DETECTED
          );
        }

        // Check if expired
        if (refreshToken.expiresAt < now) {
          throw new HttpError(
            HTTP_STATUS.UNAUTHORIZED,
            ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID
          );
        }

        // Atomically revoke the token
        await tx.refreshToken.update({
          where: { token },
          data: { revokedAt: now },
        });

        return refreshToken as RefreshTokenWithUser;
      });

      return result;
    } catch (error) {
      // Re-throw HttpError as-is
      if (error instanceof HttpError) {
        throw error;
      }
      // Handle Prisma transaction errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new HttpError(
            HTTP_STATUS.UNAUTHORIZED,
            ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID
          );
        }
      }
      // Generic database error
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Failed to process refresh token'
      );
    }
  },
};
