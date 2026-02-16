import { ApiErrorResponse, ErrorKey } from '@shirans/shared';

/**
 * Frontend Error Object
 */
export interface AppError {
  errorKey: ErrorKey;
  statusCode: number;
  message: string;
  originalError?: unknown;
  isNetworkError?: boolean;
  isAuthError?: boolean;
}

/**
 * Error Handler Result
 */
export interface ErrorHandlerResult {
  message: string;
  statusCode: number;
  shouldRetry: boolean;
  shouldLogout: boolean;
}

export type { ApiErrorResponse };
