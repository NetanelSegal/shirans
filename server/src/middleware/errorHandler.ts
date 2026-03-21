import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import logger from './logger';
import { env } from '../utils/env';
import {
  errorMessagesMap,
  getServerErrorMessage,
  ServerErrorMessage,
} from '@/constants/errorMessages';
import { HTTP_STATUS, HttpStatus, ErrorKey } from '@shirans/shared';

// Reverse lookup: English message → ErrorKey
const messageToKeyMap = new Map<string, ErrorKey>();
for (const [key, message] of Object.entries(errorMessagesMap)) {
  messageToKeyMap.set(message, key as ErrorKey);
}

interface ErrorResponse {
  error: string;
  message: string;
  errorKey?: string;
  stack?: string;
  validationErrors?: string;
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Log the error
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Handle Multer file-upload errors as 400 Bad Request
  if (err instanceof MulterError) {
    const multerKey =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'VALIDATION.FILE_TOO_LARGE'
        : err.code === 'LIMIT_FILE_COUNT'
          ? 'VALIDATION.TOO_MANY_FILES'
          : 'VALIDATION.INVALID_INPUT';
    const message = getServerErrorMessage(multerKey as ErrorKey);
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: 'MulterError',
      message,
      errorKey: multerKey,
    } satisfies ErrorResponse);
    return;
  }

  // Determine status code
  let statusCode: HttpStatus = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  if (err instanceof HttpError) {
    statusCode = err.statusCode;
  }

  // Build error response
  const errorKey = messageToKeyMap.get(err.message);
  const errorResponse: ErrorResponse = {
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    ...(errorKey && { errorKey }),
  };

  // Include stack trace in development
  if (env.NODE_ENV === 'development' && err.stack) {
    errorResponse.stack = err.stack;
    if (err instanceof CustomZodError) {
      errorResponse.validationErrors = err.validationErrors;
    }
  }

  res.status(statusCode).json(errorResponse);
}

// Custom HTTP Error class
export class HttpError extends Error {
  statusCode: HttpStatus;

  constructor(statusCode: HttpStatus, message: ServerErrorMessage) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HttpError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class CustomZodError extends HttpError {
  validationErrors: string;

  constructor(validationErrors: string) {
    super(
      HTTP_STATUS.BAD_REQUEST,
      getServerErrorMessage('VALIDATION.INVALID_INPUT'),
    );
    this.validationErrors = validationErrors;
  }
}
