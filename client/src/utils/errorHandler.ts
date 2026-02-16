import { AxiosError } from 'axios';
import { HTTP_STATUS } from '../constants/httpStatus';
import { ERROR_MESSAGES } from '../constants/errorMessages';
import { ERROR_KEYS, ErrorKey } from '@shirans/shared';
import {
  ApiErrorResponse,
  AppError,
  ErrorHandlerResult,
} from '../types/error.types';

/**
 * Check if error is an Axios error
 */
export function isAxiosError(
  error: unknown,
): error is AxiosError<ApiErrorResponse> {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
}

/**
 * Check if error is a network error (no response from server)
 */
export function isNetworkError(error: unknown): boolean {
  if (isAxiosError(error)) {
    return !error.response; // No response = network error
  }
  return false;
}

/**
 * Get Hebrew message from errorKey if available
 */
function getHebrewMessageFromKey(errorKey: string | undefined): string | undefined {
  if (!errorKey) return undefined;
  return ERROR_MESSAGES[errorKey as ErrorKey];
}

/**
 * Extract error message from API error response
 * Prefers Hebrew message via errorKey, falls back to raw API message
 */
export function extractApiErrorMessage(
  error: AxiosError<ApiErrorResponse>,
): string {
  // Try to get Hebrew message via errorKey from server
  const hebrewMessage = getHebrewMessageFromKey(error.response?.data?.errorKey);
  if (hebrewMessage) {
    return hebrewMessage;
  }

  // Fallback to raw API message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message) {
    return error.message;
  }

  return ERROR_MESSAGES[ERROR_KEYS.NETWORK.UNKNOWN_ERROR];
}

/**
 * Map HTTP status code to user-friendly Hebrew message
 */
export function getErrorMessageForStatus(statusCode: number): string {
  switch (statusCode) {
    case HTTP_STATUS.BAD_REQUEST:
      return ERROR_MESSAGES[ERROR_KEYS.VALIDATION.INVALID_INPUT];
    case HTTP_STATUS.UNAUTHORIZED:
      return ERROR_MESSAGES[ERROR_KEYS.AUTH.AUTHENTICATION_REQUIRED];
    case HTTP_STATUS.FORBIDDEN:
      return ERROR_MESSAGES[ERROR_KEYS.AUTH.ADMIN_ACCESS_REQUIRED];
    case HTTP_STATUS.NOT_FOUND:
      return ERROR_MESSAGES[ERROR_KEYS.NOT_FOUND.RESOURCE_NOT_FOUND];
    case HTTP_STATUS.CONFLICT:
      return ERROR_MESSAGES[ERROR_KEYS.CONFLICT.EMAIL_ALREADY_EXISTS];
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      return ERROR_MESSAGES[ERROR_KEYS.NETWORK.SERVER_ERROR];
    default:
      return ERROR_MESSAGES[ERROR_KEYS.NETWORK.UNKNOWN_ERROR];
  }
}

/**
 * Check if error is already an AppError
 */
function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    'message' in error &&
    typeof (error as AppError).statusCode === 'number' &&
    typeof (error as AppError).message === 'string'
  );
}

/**
 * Transform any error to AppError format
 */
export function transformError(error: unknown): AppError {
  // Already transformed - return as-is
  if (isAppError(error)) {
    return error;
  }

  // Network error (no response)
  if (isNetworkError(error)) {
    return {
      statusCode: 0,
      message: ERROR_MESSAGES[ERROR_KEYS.NETWORK.CONNECTION_ERROR],
      isNetworkError: true,
      originalError: error,
    };
  }

  // Axios error with response
  if (isAxiosError(error)) {
    const statusCode =
      error.response?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const apiMessage = extractApiErrorMessage(error);

    // Try to match API message to our error constants
    // If API returns backend error message, use it directly
    // Otherwise, map status code to Hebrew message

    return {
      statusCode,
      message: apiMessage || getErrorMessageForStatus(statusCode),
      isAuthError:
        statusCode === HTTP_STATUS.UNAUTHORIZED ||
        statusCode === HTTP_STATUS.FORBIDDEN,
      originalError: error,
    };
  }

  // Generic error
  if (error instanceof Error) {
    return {
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message:
        error.message || ERROR_MESSAGES[ERROR_KEYS.NETWORK.UNKNOWN_ERROR],
      originalError: error,
    };
  }

  // Unknown error
  return {
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: ERROR_MESSAGES[ERROR_KEYS.NETWORK.UNKNOWN_ERROR],
    originalError: error,
  };
}

/**
 * Handle error and determine action (retry, logout, etc.)
 */
export function handleError(error: unknown): ErrorHandlerResult {
  const appError = transformError(error);

  return {
    message: appError.message,
    statusCode: appError.statusCode,
    shouldRetry: appError.isNetworkError || appError.statusCode >= 500,
    shouldLogout:
      !!appError.isAuthError &&
      appError.statusCode === HTTP_STATUS.UNAUTHORIZED,
  };
}

/**
 * Log error (console in dev, service in prod)
 */
export function logError(error: unknown, context?: string): void {
  const appError = transformError(error);

  if (import.meta.env.DEV) {
    console.error(`[Error${context ? ` in ${context}` : ''}]`, {
      message: appError.message,
      statusCode: appError.statusCode,
      originalError: appError.originalError,
    });
  } else {
    // TODO: Send to error tracking service (Sentry, etc.)
    // errorTrackingService.captureException(error, { context });
  }
}
