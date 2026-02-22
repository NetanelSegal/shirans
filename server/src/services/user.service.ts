import { userRepository } from '../repositories/user.repository';
import type { UserResponse } from '@shirans/shared';
import { HttpError } from '../middleware/errorHandler';
import { HTTP_STATUS } from '../constants/httpStatus';
import { getServerErrorMessage } from '@/constants/errorMessages';
import logger from '../middleware/logger';

/**
 * User Service
 * Business logic layer for user operations (admin)
 */
export const userService = {
  /**
   * Get all users (admin only)
   * @returns Array of users (excludes password)
   */
  async getAllUsers(): Promise<UserResponse[]> {
    try {
      return await userRepository.findAll();
    } catch (error) {
      logger.error('Error fetching users', { error });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.USER.FETCH_USERS_FAILED'),
      );
    }
  },
};
