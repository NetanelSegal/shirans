import { userRepository } from '../repositories/user.repository';
import { refreshTokenRepository } from '../repositories/refreshToken.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken, verifyToken } from '../utils/jwt';
import { HttpError } from '../middleware/errorHandler';
import { HTTP_STATUS } from '../constants/httpStatus';
import { getServerErrorMessage } from '@/constants/errorMessages';
import type {
  UserResponse,
  RegisterInput,
  LoginInput,
  AuthResponse,
  TokenPayload,
  RefreshTokenResponse,
} from '../types/auth.types';
import { env } from '../utils/env';
import logger from '../middleware/logger';

/**
 * Transform Prisma User to UserResponse (exclude password)
 */
function transformUserToResponse(user: {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as UserResponse['role'],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Auth Service
 * Business logic layer for authentication operations
 */
export const authService = {
  /**
   * Register a new user
   * @param data - Registration data (email, password, name)
   * @returns User and JWT token
   * @throws HttpError 409 if email already exists
   */
  async register(data: RegisterInput): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new HttpError(
          HTTP_STATUS.CONFLICT,
          getServerErrorMessage('CONFLICT.EMAIL_ALREADY_EXISTS'),
        );
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password);

      // Create user (defaults to USER role)
      const user = await userRepository.create({
        email: data.email,
        password: hashedPassword,
        name: data.name,
      });

      // Generate access token
      const accessToken = signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Generate refresh token and store in database
      const refreshTokenExpiresAt = this.calculateRefreshTokenExpiry();

      const refreshTokenRecord = await refreshTokenRepository.create(
        user.id,
        refreshTokenExpiresAt,
      );

      return {
        user: transformUserToResponse(user),
        accessToken,
        refreshToken: refreshTokenRecord.token,
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      // Don't log email for privacy - log only error details
      logger.error('Error registering user', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.USER.REGISTRATION_FAILED'),
      );
    }
  },

  /**
   * Login user
   * @param data - Login data (email, password)
   * @returns User and JWT token
   * @throws HttpError 401 if invalid credentials
   */
  async login(data: LoginInput): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await userRepository.findByEmail(data.email);
      if (!user) {
        // Don't reveal if email exists (security best practice)
        throw new HttpError(
          HTTP_STATUS.UNAUTHORIZED,
          getServerErrorMessage('AUTH.INVALID_CREDENTIALS'),
        );
      }

      // Compare password
      const isPasswordValid = await comparePassword(
        data.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new HttpError(
          HTTP_STATUS.UNAUTHORIZED,
          getServerErrorMessage('AUTH.INVALID_CREDENTIALS'),
        );
      }

      // Generate access token
      const accessToken = signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Generate refresh token and store in database
      const refreshTokenExpiresAt = this.calculateRefreshTokenExpiry();

      const refreshTokenRecord = await refreshTokenRepository.create(
        user.id,
        refreshTokenExpiresAt,
      );

      return {
        user: transformUserToResponse(user),
        accessToken,
        refreshToken: refreshTokenRecord.token,
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      // Don't log email for privacy - log only error details
      logger.error('Error logging in user', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.USER.LOGIN_FAILED'),
      );
    }
  },

  /**
   * Verify JWT token
   * @param token - JWT token to verify
   * @returns Decoded token payload
   * @throws HttpError 401 if token is invalid
   */
  verifyToken(token: string): TokenPayload {
    try {
      return verifyToken(token);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(
          HTTP_STATUS.UNAUTHORIZED,
          getServerErrorMessage('AUTH.TOKEN_INVALID'),
        );
      }
      throw new HttpError(
        HTTP_STATUS.UNAUTHORIZED,
        getServerErrorMessage('AUTH.TOKEN_INVALID'),
      );
    }
  },

  /**
   * Get current user by ID
   * @param userId - User ID
   * @returns User response
   * @throws HttpError 404 if user not found
   */
  async getCurrentUser(userId: string): Promise<UserResponse> {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new HttpError(
          HTTP_STATUS.NOT_FOUND,
          getServerErrorMessage('NOT_FOUND.USER_NOT_FOUND'),
        );
      }
      return transformUserToResponse(user);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      logger.error('Error getting current user', { error, userId });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.USER.FETCH_USER_FAILED'),
      );
    }
  },

  /**
   * Refresh access token using refresh token
   * @param refreshTokenString - Refresh token string
   * @returns New access token and refresh token
   * @throws HttpError 401 if refresh token is invalid or reused
   */
  async refreshAccessToken(
    refreshTokenString: string,
  ): Promise<RefreshTokenResponse> {
    try {
      // Atomically find and revoke token (prevents race conditions)
      // This also validates the token (not expired, not already revoked)
      let refreshToken;
      try {
        refreshToken =
          await refreshTokenRepository.findAndRevokeToken(refreshTokenString);
      } catch (error) {
        // Check if this is a reuse detection (token already revoked)
        if (
          error instanceof HttpError &&
          error.message === getServerErrorMessage('AUTH.TOKEN_REUSE_DETECTED')
        ) {
          // Security breach: token was reused - revoke ALL user tokens
          const tempToken =
            await refreshTokenRepository.findByToken(refreshTokenString);
          if (tempToken) {
            await refreshTokenRepository.revokeAllForUser(tempToken.userId);
            logger.warn(
              'Refresh token reuse detected - revoked all user tokens',
              {
                userId: tempToken.userId,
              },
            );
          }
          throw new HttpError(
            HTTP_STATUS.UNAUTHORIZED,
            getServerErrorMessage('AUTH.TOKEN_REUSE_DETECTED'),
          );
        }
        // Re-throw HttpError as-is (from repository)
        if (error instanceof HttpError) {
          throw error;
        }
        // Other errors (shouldn't happen, but handle gracefully)
        throw new HttpError(
          HTTP_STATUS.UNAUTHORIZED,
          getServerErrorMessage('AUTH.REFRESH_TOKEN_INVALID'),
        );
      }

      const user = refreshToken.user;

      // Generate new access token
      const accessToken = signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Generate new refresh token
      const refreshTokenExpiresAt = this.calculateRefreshTokenExpiry();
      const newRefreshTokenRecord = await refreshTokenRepository.create(
        user.id,
        refreshTokenExpiresAt,
      );

      return {
        accessToken,
        refreshToken: newRefreshTokenRecord.token,
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      logger.error('Error refreshing token', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.USER.REFRESH_TOKEN_FAILED'),
      );
    }
  },

  /**
   * Logout user by revoking refresh token
   * @param refreshTokenString - Refresh token string to revoke
   * @throws HttpError 401 if refresh token is invalid
   */
  async logout(refreshTokenString: string): Promise<void> {
    try {
      const isValid = await refreshTokenRepository.isValid(refreshTokenString);
      if (!isValid) {
        // Token is already invalid/expired, consider logout successful
        return;
      }

      await refreshTokenRepository.revoke(refreshTokenString);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      logger.error('Error during logout', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      // Don't throw error on logout failure - just log it
    }
  },

  /**
   * Calculate refresh token expiry date from environment variable
   * Supports formats: "7d", "30d", "90d", "24h", etc.
   * @returns Date when refresh token expires
   */
  calculateRefreshTokenExpiry(): Date {
    const expiresIn = env.JWT_REFRESH_EXPIRES_IN;
    const expiresAt = new Date();

    // Parse duration string (e.g., "7d", "30d", "90d", "24h")
    const match = expiresIn.match(/^(\d+)([dhms])$/);
    if (!match) {
      // Default to 7 days if format is invalid
      logger.warn(
        `Invalid JWT_REFRESH_EXPIRES_IN format: ${expiresIn}, defaulting to 7d`,
      );
      expiresAt.setDate(expiresAt.getDate() + 7);
      return expiresAt;
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 'd':
        expiresAt.setDate(expiresAt.getDate() + value);
        break;
      case 'h':
        expiresAt.setHours(expiresAt.getHours() + value);
        break;
      case 'm':
        expiresAt.setMinutes(expiresAt.getMinutes() + value);
        break;
      case 's':
        expiresAt.setSeconds(expiresAt.getSeconds() + value);
        break;
      default:
        logger.warn(
          `Unknown time unit in JWT_REFRESH_EXPIRES_IN: ${unit}, defaulting to 7d`,
        );
        expiresAt.setDate(expiresAt.getDate() + 7);
    }

    return expiresAt;
  },
};
