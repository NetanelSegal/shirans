import { Request, Response, NextFunction } from 'express';
import logger from './logger';
import { env } from '../utils/env';

interface ErrorResponse {
  error: string;
  message: string;
  stack?: string;
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log the error
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Determine status code
  let statusCode = 500;
  if (err instanceof HttpError) {
    statusCode = err.statusCode;
  }

  // Build error response
  const errorResponse: ErrorResponse = {
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  };

  // Include stack trace in development
  if (env.NODE_ENV === 'development' && err.stack) {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
}

// Custom HTTP Error class
export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HttpError';
    Error.captureStackTrace(this, this.constructor);
  }
}
