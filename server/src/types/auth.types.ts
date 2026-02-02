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

// Re-export types from validators as single source of truth
export type { RegisterInput, LoginInput } from '../validators/auth.validators';

/**
 * Auth response (user + token)
 */
export interface AuthResponse {
  user: UserResponse;
  token: string;
}
