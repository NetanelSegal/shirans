import { ErrorKey, formatErrorMessage } from '@shirans/shared';

/**
 * Centralized Error Messages
 * All error messages used throughout the application
 * Uses shared ERROR_KEYS for consistency
 * Maintains backward compatibility with nested structure
 */
const errorMessagesMap = {
  'AUTH.INVALID_CREDENTIALS': 'Invalid email or password',
  'AUTH.TOKEN_REQUIRED': 'Missing or invalid authorization header',
  'AUTH.TOKEN_INVALID': 'Invalid or expired token',
  'AUTH.REFRESH_TOKEN_REQUIRED': 'Refresh token required',
  'AUTH.REFRESH_TOKEN_INVALID': 'Invalid or expired refresh token',
  'AUTH.AUTHENTICATION_REQUIRED': 'Authentication required',
  'AUTH.ADMIN_ACCESS_REQUIRED': 'Admin access required',
  'AUTH.TOKEN_REUSE_DETECTED': 'Token already used - security breach detected',

  'VALIDATION.INVALID_INPUT': 'Invalid input data',
  'VALIDATION.REQUIRED_FIELD': 'Required field',
  'VALIDATION.INVALID_EMAIL': 'Invalid email',
  'VALIDATION.INVALID_PHONE': 'Invalid phone',
  'VALIDATION.PASSWORD_TOO_SHORT': 'Password too short',
  'VALIDATION.PASSWORD_WEAK': 'Password weak',
  'VALIDATION.IMAGES_NOT_BELONG_TO_PROJECT': `Images do not belong to project`,

  'NOT_FOUND.USER_NOT_FOUND': 'User not found',
  'NOT_FOUND.PROJECT_NOT_FOUND': 'Project not found',
  'NOT_FOUND.CATEGORY_NOT_FOUND': 'One or more categories not found',
  'NOT_FOUND.MAIN_IMAGE_NOT_FOUND': 'Main image not found for project',
  'NOT_FOUND.PAGE_NOT_FOUND': 'Page not found',
  'NOT_FOUND.RESOURCE_NOT_FOUND': 'Resource not found',
  'NOT_FOUND.TESTIMONIAL_NOT_FOUND': 'Testimonial not found',

  'CONFLICT.EMAIL_ALREADY_EXISTS': 'Email already registered',
  'CONFLICT.PROJECT_TITLE_EXISTS': 'A project with this title already exists',
  'CONFLICT.TOKEN_ALREADY_EXISTS': 'Token already exists - please try again',
  'CONFLICT.CATEGORY_URL_CODE_EXISTS': 'Category URL code already exists',
  'CONFLICT.CATEGORY_HAS_ASSOCIATED_PROJECTS':
    'Category has associated projects',

  'SERVER.PROJECT.FETCHS_FAILED': 'Failed to fetch projects',
  'SERVER.PROJECT.FETCH_FAVOURITES_FAILED':
    'Failed to fetch favourite projects',
  'SERVER.PROJECT.FETCH_BY_ID_FAILED': 'Failed to fetch project by id',

  'SERVER.CATEGORY.CREATE_FAILED': 'Failed to create category',
  'SERVER.CATEGORY.UPDATE_FAILED': 'Failed to update category',
  'SERVER.CATEGORY.DELETE_FAILED': 'Failed to delete category',
  'SERVER.CATEGORY.FETCHS_FAILED': 'Failed to fetch categories',
  'SERVER.CATEGORY.FETCH_BY_ID_FAILED': 'Failed to fetch category by id',

  'SERVER.TESTIMONIAL.FETCHS_FAILED': 'Failed to fetch testimonials',
  'SERVER.TESTIMONIAL.FETCH_BY_ID_FAILED': 'Failed to fetch testimonial by id',

  'NETWORK.CONNECTION_ERROR': 'Connection error',
  'NETWORK.TIMEOUT': 'Timeout',
  'NETWORK.SERVER_ERROR': 'Server error',
  'NETWORK.UNKNOWN_ERROR': 'Unknown error',

  'SERVER.CONTACT.DELETE_SUBMISSION_FAILED':
    'Failed to delete contact submission',
  'SERVER.CONTACT.FETCH_SUBMISSIONS_FAILED':
    'Failed to fetch contact submissions',
  'SERVER.CONTACT.FETCH_SUBMISSION_BY_ID_FAILED':
    'Failed to fetch contact submission by id',
  'SERVER.CONTACT.SUBMIT_FAILED': 'Failed to submit contact',
  'SERVER.CONTACT.UPDATE_SUBMISSION_FAILED':
    'Failed to update contact submission',

  'SERVER.PROJECT.CREATE_FAILED': 'Failed to create project',
  'SERVER.PROJECT.DELETE_FAILED': 'Failed to delete project',
  'SERVER.PROJECT.UPDATE_FAILED': 'Failed to update project',
  'SERVER.PROJECT.UPLOAD_IMAGES_FAILED': 'Failed to upload project images',
  'SERVER.PROJECT.DELETE_PROJECT_IMAGES_FAILED':
    'Failed to delete project images',
  'SERVER.PROJECT.DELETE_MAIN_IMAGE_FAILED': 'Failed to delete main image',

  'SERVER.TESTIMONIAL.CREATE_FAILED': 'Failed to create testimonial',
  'SERVER.TESTIMONIAL.DELETE_FAILED': 'Failed to delete testimonial',
  'SERVER.TESTIMONIAL.UPDATE_FAILED': 'Failed to update testimonial',

  'SERVER.USER.REGISTRATION_FAILED': 'Failed to register user',
  'SERVER.USER.LOGIN_FAILED': 'Failed to login user',
  'SERVER.USER.FETCH_USER_FAILED': 'Failed to fetch user',
  'SERVER.USER.REFRESH_TOKEN_FAILED': 'Failed to refresh token',

  'SERVER.REFRESH_TOKEN.CREATE_FAILED': 'Failed to create refresh token',
  'SERVER.REFRESH_TOKEN.REVOKE_FAILED': 'Failed to revoke refresh token',
  'SERVER.REFRESH_TOKEN.PROCESS_FAILED': 'Failed to process refresh token',
} as const satisfies Record<ErrorKey, string>;

export type ServerErrorMessage = (typeof errorMessagesMap)[ErrorKey];

export function getServerErrorMessage(key: ErrorKey): ServerErrorMessage {
  return formatErrorMessage(errorMessagesMap, key);
}
