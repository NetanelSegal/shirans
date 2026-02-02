import { prisma } from '../config/database';
import type { Prisma } from '../../prisma/generated/prisma/client';
import { UserRole } from '../../prisma/generated/prisma/enums';

/**
 * User with all fields
 */
type User = Prisma.UserGetPayload<Record<string, never>>;

/**
 * User Repository
 * Handles all database access for Users using Prisma ORM
 */
export const userRepository = {
  /**
   * Find a user by email
   * @param email - User email
   * @returns User or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  /**
   * Find a user by ID
   * @param id - User ID
   * @returns User or null if not found
   */
  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  /**
   * Create a new user
   * @param data - User data including email, password (hashed), name, and role
   * @returns Created user
   */
  async create(data: {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
  }): Promise<User> {
    return await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role || UserRole.USER,
      },
    });
  },

  /**
   * Update user password
   * @param id - User ID
   * @param hashedPassword - New hashed password
   * @returns Updated user
   */
  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  },
};
