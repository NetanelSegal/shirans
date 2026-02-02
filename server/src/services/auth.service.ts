import { userRepository } from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken, verifyToken, type TokenPayload } from '../utils/jwt';
import { HttpError } from '../middleware/errorHandler';
import type { UserResponse, RegisterInput, LoginInput, AuthResponse } from '../types/auth.types';
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
        throw new HttpError(409, 'Email already registered');
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password);

      // Create user (defaults to USER role)
      const user = await userRepository.create({
        email: data.email,
        password: hashedPassword,
        name: data.name,
      });

      // Generate JWT token
      const token = signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        user: transformUserToResponse(user),
        token,
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      logger.error('Error registering user', { error, email: data.email });
      throw new HttpError(500, 'Failed to register user');
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
        throw new HttpError(401, 'Invalid email or password');
      }

      // Compare password
      const isPasswordValid = await comparePassword(data.password, user.password);
      if (!isPasswordValid) {
        throw new HttpError(401, 'Invalid email or password');
      }

      // Generate JWT token
      const token = signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        user: transformUserToResponse(user),
        token,
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      logger.error('Error logging in user', { error, email: data.email });
      throw new HttpError(500, 'Failed to login');
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
        throw new HttpError(401, error.message);
      }
      throw new HttpError(401, 'Invalid token');
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
        throw new HttpError(404, 'User not found');
      }
      return transformUserToResponse(user);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      logger.error('Error getting current user', { error, userId });
      throw new HttpError(500, 'Failed to get user');
    }
  },
};
