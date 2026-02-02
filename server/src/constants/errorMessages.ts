import { ERROR_KEYS } from '@shirans/shared';

/**
 * Centralized Error Messages
 * All error messages used throughout the application
 * Uses shared ERROR_KEYS for consistency
 * Maintains backward compatibility with nested structure
 */
const errorMessagesMap: Record<string, string | ((...args: unknown[]) => string)> = {
  [ERROR_KEYS.AUTH.INVALID_CREDENTIALS]: 'Invalid email or password',
  [ERROR_KEYS.AUTH.TOKEN_REQUIRED]: 'Missing or invalid authorization header',
  [ERROR_KEYS.AUTH.TOKEN_INVALID]: 'Invalid or expired token',
  [ERROR_KEYS.AUTH.REFRESH_TOKEN_REQUIRED]: 'Refresh token required',
  [ERROR_KEYS.AUTH.REFRESH_TOKEN_INVALID]: 'Invalid or expired refresh token',
  [ERROR_KEYS.AUTH.AUTHENTICATION_REQUIRED]: 'Authentication required',
  [ERROR_KEYS.AUTH.ADMIN_ACCESS_REQUIRED]: 'Admin access required',
  [ERROR_KEYS.AUTH.TOKEN_REUSE_DETECTED]: 'Token already used - security breach detected',
  [ERROR_KEYS.VALIDATION.INVALID_INPUT]: 'Invalid input data',
  [ERROR_KEYS.VALIDATION.IMAGES_NOT_BELONG_TO_PROJECT]: (imageIds: string[], projectId: string) =>
    `Images with ids ${imageIds.join(', ')} do not belong to project ${projectId}`,
  [ERROR_KEYS.NOT_FOUND.USER_NOT_FOUND]: 'User not found',
  [ERROR_KEYS.NOT_FOUND.PROJECT_NOT_FOUND]: (id: string) => `Project with id ${id} not found`,
  [ERROR_KEYS.NOT_FOUND.CATEGORY_NOT_FOUND]: 'One or more categories not found',
  [ERROR_KEYS.NOT_FOUND.MAIN_IMAGE_NOT_FOUND]: (id: string) => `Main image not found for project ${id}`,
  [ERROR_KEYS.NOT_FOUND.PAGE_NOT_FOUND]: 'Page not found',
  [ERROR_KEYS.NOT_FOUND.RESOURCE_NOT_FOUND]: 'Resource not found',
  [ERROR_KEYS.CONFLICT.EMAIL_ALREADY_EXISTS]: 'Email already registered',
  [ERROR_KEYS.CONFLICT.PROJECT_TITLE_EXISTS]: 'A project with this title already exists',
  [ERROR_KEYS.SERVER.REGISTRATION_FAILED]: 'Failed to register user',
  [ERROR_KEYS.SERVER.LOGIN_FAILED]: 'Failed to login',
  [ERROR_KEYS.SERVER.FETCH_USER_FAILED]: 'Failed to get user',
  [ERROR_KEYS.SERVER.REFRESH_TOKEN_FAILED]: 'Failed to refresh token',
  [ERROR_KEYS.SERVER.FETCH_PROJECTS_FAILED]: 'Failed to fetch projects',
  [ERROR_KEYS.SERVER.FETCH_FAVOURITE_PROJECTS_FAILED]: 'Failed to fetch favourite projects',
  [ERROR_KEYS.SERVER.CREATE_PROJECT_FAILED]: 'Failed to create project',
  [ERROR_KEYS.SERVER.UPDATE_PROJECT_FAILED]: 'Failed to update project',
  [ERROR_KEYS.SERVER.DELETE_PROJECT_FAILED]: 'Failed to delete project',
  [ERROR_KEYS.SERVER.SUBMIT_CONTACT_FAILED]: 'Failed to submit contact form',
};

/**
 * Get error message by ERROR_KEY
 */
export function getErrorMessage(key: string, ...args: unknown[]): string {
  const message = errorMessagesMap[key];
  if (typeof message === 'function') {
    return message(...args);
  }
  return message || 'Unknown error';
}

/**
 * Backward compatible nested structure
 * @deprecated Use getErrorMessage with ERROR_KEYS instead
 */
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: errorMessagesMap[ERROR_KEYS.AUTH.INVALID_CREDENTIALS] as string,
    TOKEN_REQUIRED: errorMessagesMap[ERROR_KEYS.AUTH.TOKEN_REQUIRED] as string,
    TOKEN_INVALID: errorMessagesMap[ERROR_KEYS.AUTH.TOKEN_INVALID] as string,
    REFRESH_TOKEN_REQUIRED: errorMessagesMap[ERROR_KEYS.AUTH.REFRESH_TOKEN_REQUIRED] as string,
    REFRESH_TOKEN_INVALID: errorMessagesMap[ERROR_KEYS.AUTH.REFRESH_TOKEN_INVALID] as string,
    AUTHENTICATION_REQUIRED: errorMessagesMap[ERROR_KEYS.AUTH.AUTHENTICATION_REQUIRED] as string,
    ADMIN_ACCESS_REQUIRED: errorMessagesMap[ERROR_KEYS.AUTH.ADMIN_ACCESS_REQUIRED] as string,
    TOKEN_REUSE_DETECTED: errorMessagesMap[ERROR_KEYS.AUTH.TOKEN_REUSE_DETECTED] as string,
  },
  VALIDATION: {
    INVALID_INPUT: errorMessagesMap[ERROR_KEYS.VALIDATION.INVALID_INPUT] as string,
    IMAGES_NOT_BELONG_TO_PROJECT: errorMessagesMap[ERROR_KEYS.VALIDATION.IMAGES_NOT_BELONG_TO_PROJECT] as (imageIds: string[], projectId: string) => string,
  },
  NOT_FOUND: {
    USER_NOT_FOUND: errorMessagesMap[ERROR_KEYS.NOT_FOUND.USER_NOT_FOUND] as string,
    PROJECT_NOT_FOUND: errorMessagesMap[ERROR_KEYS.NOT_FOUND.PROJECT_NOT_FOUND] as (id: string) => string,
    CATEGORY_NOT_FOUND: errorMessagesMap[ERROR_KEYS.NOT_FOUND.CATEGORY_NOT_FOUND] as string,
    MAIN_IMAGE_NOT_FOUND: errorMessagesMap[ERROR_KEYS.NOT_FOUND.MAIN_IMAGE_NOT_FOUND] as (id: string) => string,
  },
  CONFLICT: {
    EMAIL_ALREADY_EXISTS: errorMessagesMap[ERROR_KEYS.CONFLICT.EMAIL_ALREADY_EXISTS] as string,
    PROJECT_TITLE_EXISTS: errorMessagesMap[ERROR_KEYS.CONFLICT.PROJECT_TITLE_EXISTS] as string,
  },
  SERVER: {
    REGISTRATION_FAILED: errorMessagesMap[ERROR_KEYS.SERVER.REGISTRATION_FAILED] as string,
    LOGIN_FAILED: errorMessagesMap[ERROR_KEYS.SERVER.LOGIN_FAILED] as string,
    FETCH_USER_FAILED: errorMessagesMap[ERROR_KEYS.SERVER.FETCH_USER_FAILED] as string,
    REFRESH_TOKEN_FAILED: errorMessagesMap[ERROR_KEYS.SERVER.REFRESH_TOKEN_FAILED] as string,
    FETCH_PROJECTS_FAILED: errorMessagesMap[ERROR_KEYS.SERVER.FETCH_PROJECTS_FAILED] as string,
    FETCH_FAVOURITE_PROJECTS_FAILED: errorMessagesMap[ERROR_KEYS.SERVER.FETCH_FAVOURITE_PROJECTS_FAILED] as string,
    CREATE_PROJECT_FAILED: errorMessagesMap[ERROR_KEYS.SERVER.CREATE_PROJECT_FAILED] as string,
    UPDATE_PROJECT_FAILED: errorMessagesMap[ERROR_KEYS.SERVER.UPDATE_PROJECT_FAILED] as string,
    DELETE_PROJECT_FAILED: errorMessagesMap[ERROR_KEYS.SERVER.DELETE_PROJECT_FAILED] as string,
    SUBMIT_CONTACT_FAILED: errorMessagesMap[ERROR_KEYS.SERVER.SUBMIT_CONTACT_FAILED] as string,
  },
} as const;
