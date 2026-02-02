/**
 * Centralized Error Messages
 * All error messages used throughout the application
 * Organized by category for better maintainability
 */
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    TOKEN_REQUIRED: 'Missing or invalid authorization header',
    TOKEN_INVALID: 'Invalid or expired token',
    REFRESH_TOKEN_REQUIRED: 'Refresh token required',
    REFRESH_TOKEN_INVALID: 'Invalid or expired refresh token',
    AUTHENTICATION_REQUIRED: 'Authentication required',
    ADMIN_ACCESS_REQUIRED: 'Admin access required',
    TOKEN_REUSE_DETECTED: 'Token already used - security breach detected',
  },
  VALIDATION: {
    INVALID_INPUT: 'Invalid input data',
    IMAGES_NOT_BELONG_TO_PROJECT: (imageIds: string[], projectId: string) =>
      `Images with ids ${imageIds.join(', ')} do not belong to project ${projectId}`,
  },
  NOT_FOUND: {
    USER_NOT_FOUND: 'User not found',
    PROJECT_NOT_FOUND: (id: string) => `Project with id ${id} not found`,
    CATEGORY_NOT_FOUND: 'One or more categories not found',
    MAIN_IMAGE_NOT_FOUND: (id: string) => `Main image not found for project ${id}`,
  },
  CONFLICT: {
    EMAIL_ALREADY_EXISTS: 'Email already registered',
    PROJECT_TITLE_EXISTS: 'A project with this title already exists',
  },
  SERVER: {
    REGISTRATION_FAILED: 'Failed to register user',
    LOGIN_FAILED: 'Failed to login',
    FETCH_USER_FAILED: 'Failed to get user',
    REFRESH_TOKEN_FAILED: 'Failed to refresh token',
    FETCH_PROJECTS_FAILED: 'Failed to fetch projects',
    FETCH_FAVOURITE_PROJECTS_FAILED: 'Failed to fetch favourite projects',
    CREATE_PROJECT_FAILED: 'Failed to create project',
    FETCH_PROJECT_FAILED: 'Failed to fetch project',
    UPDATE_PROJECT_FAILED: 'Failed to update project',
    UPLOAD_IMAGES_FAILED: 'Failed to upload project images',
    DELETE_MAIN_IMAGE_FAILED: 'Failed to delete main image',
    DELETE_PROJECT_FAILED: 'Failed to delete project',
    DELETE_PROJECT_IMAGES_FAILED: 'Failed to delete project images',
  },
} as const;
