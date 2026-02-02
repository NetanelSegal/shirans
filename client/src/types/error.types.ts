import { ApiErrorResponse } from '@shirans/shared';
import { HTTP_STATUS } from '../constants/httpStatus';

/**
 * Frontend Error Object
 */
export interface AppError {
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
