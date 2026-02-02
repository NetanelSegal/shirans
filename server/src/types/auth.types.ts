import type { UserRole } from '../../prisma/generated/prisma/client';

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

/**
 * Register input data
 */
export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

/**
 * Login input data
 */
export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Auth response (user + token)
 */
export interface AuthResponse {
  user: UserResponse;
  token: string;
}
