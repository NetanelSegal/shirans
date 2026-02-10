import { Request, Response, NextFunction } from 'express';
import { HttpError } from './errorHandler';
import { HTTP_STATUS } from '../constants/httpStatus';
import { UserRole } from '@prisma/client';
import { getServerErrorMessage } from '@/constants/errorMessages';

/**
 * Require admin role middleware
 * Must be used after authenticate middleware
 * Returns 403 if user is not an admin
 */
export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    next(
      new HttpError(
        HTTP_STATUS.UNAUTHORIZED,
        getServerErrorMessage('AUTH.AUTHENTICATION_REQUIRED'),
      ),
    );
    return;
  }

  if (req.user.role !== UserRole.ADMIN) {
    next(
      new HttpError(
        HTTP_STATUS.FORBIDDEN,
        getServerErrorMessage('AUTH.ADMIN_ACCESS_REQUIRED'),
      ),
    );
    return;
  }

  next();
}

/**
 * Require authentication middleware (any role)
 * Must be used after authenticate middleware
 * Returns 401 if user is not authenticated
 */
export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    next(
      new HttpError(
        HTTP_STATUS.UNAUTHORIZED,
        getServerErrorMessage('AUTH.AUTHENTICATION_REQUIRED'),
      ),
    );
    return;
  }

  next();
}
