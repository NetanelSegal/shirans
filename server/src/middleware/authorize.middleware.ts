import { Request, Response, NextFunction } from 'express';
import { HttpError } from './errorHandler';
import { UserRole } from '../../prisma/generated/prisma/enums';

/**
 * Require admin role middleware
 * Must be used after authenticate middleware
 * Returns 403 if user is not an admin
 */
export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    next(new HttpError(401, 'Authentication required'));
    return;
  }

  if (req.user.role !== UserRole.ADMIN) {
    next(new HttpError(403, 'Admin access required'));
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
  next: NextFunction
): void {
  if (!req.user) {
    next(new HttpError(401, 'Authentication required'));
    return;
  }

  next();
}
