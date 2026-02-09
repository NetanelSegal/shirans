import { ERROR_KEYS } from '@shirans/shared';

/**
 * Centralized Error Messages
 * All error messages used throughout the application
 * Uses shared ERROR_KEYS for consistency
 * Maintains backward compatibility with nested structure
 */
const errorMessagesMap: Record<
  string,
  string | ((...args: unknown[]) => string)
> = {
  [ERROR_KEYS.AUTH.INVALID_CREDENTIALS]: 'Invalid email or password',
  [ERROR_KEYS.AUTH.TOKEN_REQUIRED]: 'Missing or invalid authorization header',
  [ERROR_KEYS.AUTH.TOKEN_INVALID]: 'Invalid or expired token',
  [ERROR_KEYS.AUTH.REFRESH_TOKEN_REQUIRED]: 'Refresh token required',
  [ERROR_KEYS.AUTH.REFRESH_TOKEN_INVALID]: 'Invalid or expired refresh token',
  [ERROR_KEYS.AUTH.AUTHENTICATION_REQUIRED]: 'Authentication required',
  [ERROR_KEYS.AUTH.ADMIN_ACCESS_REQUIRED]: 'Admin access required',
  [ERROR_KEYS.AUTH.TOKEN_REUSE_DETECTED]:
    'Token already used - security breach detected',
  [ERROR_KEYS.VALIDATION.INVALID_INPUT]: 'Invalid input data',
  [ERROR_KEYS.VALIDATION.IMAGES_NOT_BELONG_TO_PROJECT]: (
    ...args: unknown[]
  ) => {
    const [imageIds, projectId] = args;
    if (Array.isArray(imageIds) && typeof projectId === 'string') {
      return `Images with ids ${imageIds.join(', ')} do not belong to project ${projectId}`;
    }
    return 'Invalid arguments for IMAGES_NOT_BELONG_TO_PROJECT';
  },
  [ERROR_KEYS.NOT_FOUND.USER_NOT_FOUND]: 'User not found',
  [ERROR_KEYS.NOT_FOUND.PROJECT_NOT_FOUND]: (...args: unknown[]) => {
    const [id] = args;
    if (typeof id === 'string') {
      return `Project with id ${id} not found`;
    }
    return 'Invalid arguments for PROJECT_NOT_FOUND';
  },
  [ERROR_KEYS.NOT_FOUND.CATEGORY_NOT_FOUND]: 'One or more categories not found',
  [ERROR_KEYS.NOT_FOUND.MAIN_IMAGE_NOT_FOUND]: (...args: unknown[]) => {
    const [id] = args;
    if (typeof id === 'string') {
      return `Main image not found for project ${id}`;
    }
    return 'Invalid arguments for MAIN_IMAGE_NOT_FOUND';
  },
  [ERROR_KEYS.NOT_FOUND.PAGE_NOT_FOUND]: 'Page not found',
  [ERROR_KEYS.NOT_FOUND.RESOURCE_NOT_FOUND]: 'Resource not found',
  [ERROR_KEYS.CONFLICT.EMAIL_ALREADY_EXISTS]: 'Email already registered',
  [ERROR_KEYS.CONFLICT.PROJECT_TITLE_EXISTS]:
    'A project with this title already exists',
  [ERROR_KEYS.SERVER.REGISTRATION_FAILED]: 'Failed to register user',
  [ERROR_KEYS.SERVER.LOGIN_FAILED]: 'Failed to login',
  [ERROR_KEYS.SERVER.FETCH_USER_FAILED]: 'Failed to get user',
  [ERROR_KEYS.SERVER.REFRESH_TOKEN_FAILED]: 'Failed to refresh token',
  [ERROR_KEYS.SERVER.FETCH_PROJECTS_FAILED]: 'Failed to fetch projects',
  [ERROR_KEYS.SERVER.FETCH_FAVOURITE_PROJECTS_FAILED]:
    'Failed to fetch favourite projects',
  [ERROR_KEYS.SERVER.CREATE_PROJECT_FAILED]: 'Failed to create project',
  [ERROR_KEYS.SERVER.UPDATE_PROJECT_FAILED]: 'Failed to update project',
  [ERROR_KEYS.SERVER.DELETE_PROJECT_FAILED]: 'Failed to delete project',
  [ERROR_KEYS.SERVER.SUBMIT_CONTACT_FAILED]: 'Failed to submit contact form',
  [ERROR_KEYS.SERVER.UPLOAD_IMAGES_FAILED]: 'Failed to upload images',
  [ERROR_KEYS.SERVER.DELETE_MAIN_IMAGE_FAILED]: 'Failed to delete main image',
  [ERROR_KEYS.SERVER.DELETE_PROJECT_IMAGES_FAILED]:
    'Failed to delete project images',
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

function buildErrorMessages(
  errorKeys: any,
  messagesMap: Record<string, any>,
): any {
  const result: any = {};
  for (const key in errorKeys) {
    if (typeof errorKeys[key] === 'object' && errorKeys[key] !== null) {
      result[key] = buildErrorMessages(errorKeys[key], messagesMap);
    } else {
      result[key] = messagesMap[errorKeys[key]];
    }
  }
  return result;
}

export const ERROR_MESSAGES = buildErrorMessages(ERROR_KEYS, errorMessagesMap);
