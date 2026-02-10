import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { HttpError } from './errorHandler';
import { HTTP_STATUS } from '../constants/httpStatus';
import { getServerErrorMessage } from '@/constants/errorMessages';

/**
 * Authentication middleware
 * Extracts and verifies JWT token from Authorization header
 * Attaches user info to req.user if token is valid
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !/^Bearer\s+/i.test(authHeader)) {
      throw new HttpError(
        HTTP_STATUS.UNAUTHORIZED,
        getServerErrorMessage('AUTH.TOKEN_REQUIRED'),
      );
    }

    // Extract token using regex to handle multiple spaces robustly
    const token = authHeader.replace(/^Bearer\s+/i, '');

    // Verify token
    const payload = authService.verifyToken(token);

    // Attach user info to request
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    if (error instanceof HttpError) {
      next(error);
    } else {
      next(
        new HttpError(
          HTTP_STATUS.UNAUTHORIZED,
          getServerErrorMessage('AUTH.TOKEN_INVALID'),
        ),
      );
    }
  }
}
