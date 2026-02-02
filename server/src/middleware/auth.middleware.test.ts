import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { authenticate } from './auth.middleware';
import { authService } from '../services/auth.service';
import { HttpError } from './errorHandler';
import { HTTP_STATUS } from '../constants/httpStatus';
import { ERROR_MESSAGES } from '../constants/errorMessages';
import { UserRole } from '@prisma/client';

// Mock auth service
vi.mock('../services/auth.service', () => ({
  authService: {
    verifyToken: vi.fn(),
  },
}));

describe('authenticate middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    mockRequest = {
      headers: {},
      user: undefined,
    };

    mockResponse = {};

    mockNext = vi.fn();
  });

  it('should authenticate user with valid Bearer token', () => {
    const mockPayload = {
      userId: 'user123',
      email: 'test@example.com',
      role: UserRole.USER,
    };

    mockRequest.headers = {
      authorization: 'Bearer valid-token',
    };

    vi.mocked(authService.verifyToken).mockReturnValue(mockPayload);

    authenticate(mockRequest as Request, mockResponse as Response, mockNext);

    expect(authService.verifyToken).toHaveBeenCalledWith('valid-token');
    expect(mockRequest.user).toEqual({
      userId: 'user123',
      email: 'test@example.com',
      role: UserRole.USER,
    });
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should handle Bearer token with multiple spaces', () => {
    const mockPayload = {
      userId: 'user123',
      email: 'test@example.com',
      role: UserRole.USER,
    };

    mockRequest.headers = {
      authorization: 'Bearer    valid-token',
    };

    vi.mocked(authService.verifyToken).mockReturnValue(mockPayload);

    authenticate(mockRequest as Request, mockResponse as Response, mockNext);

    expect(authService.verifyToken).toHaveBeenCalledWith('valid-token');
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should handle Bearer token case-insensitively', () => {
    const mockPayload = {
      userId: 'user123',
      email: 'test@example.com',
      role: UserRole.USER,
    };

    mockRequest.headers = {
      authorization: 'bearer valid-token', // Lowercase "bearer"
    };

    vi.mocked(authService.verifyToken).mockReturnValue(mockPayload);

    authenticate(mockRequest as Request, mockResponse as Response, mockNext);

    expect(authService.verifyToken).toHaveBeenCalledWith('valid-token');
    expect(mockRequest.user).toEqual({
      userId: 'user123',
      email: 'test@example.com',
      role: UserRole.USER,
    });
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should return 401 when authorization header is missing', () => {
    mockRequest.headers = {};

    authenticate(mockRequest as Request, mockResponse as Response, mockNext);

    expect(authService.verifyToken).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: 'Missing or invalid authorization header',
      })
    );
  });

  it('should return 401 when authorization header does not start with Bearer', () => {
    mockRequest.headers = {
      authorization: 'InvalidScheme token',
    };

    authenticate(mockRequest as Request, mockResponse as Response, mockNext);

    expect(authService.verifyToken).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: 'Missing or invalid authorization header',
      })
    );
  });

  it('should return 401 when token is invalid', () => {
    mockRequest.headers = {
      authorization: 'Bearer invalid-token',
    };

    vi.mocked(authService.verifyToken).mockImplementation(() => {
      throw new HttpError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.AUTH.TOKEN_INVALID
      );
    });

    authenticate(mockRequest as Request, mockResponse as Response, mockNext);

    expect(authService.verifyToken).toHaveBeenCalledWith('invalid-token');
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: 'Invalid or expired token',
      })
    );
  });

  it('should return 401 when token verification throws generic error', () => {
    mockRequest.headers = {
      authorization: 'Bearer bad-token',
    };

    vi.mocked(authService.verifyToken).mockImplementation(() => {
      throw new Error('Token verification failed');
    });

    authenticate(mockRequest as Request, mockResponse as Response, mockNext);

    expect(authService.verifyToken).toHaveBeenCalledWith('bad-token');
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: 'Invalid or expired token',
      })
    );
  });

  it('should attach user info with ADMIN role', () => {
    const mockPayload = {
      userId: 'admin123',
      email: 'admin@example.com',
      role: UserRole.ADMIN,
    };

    mockRequest.headers = {
      authorization: 'Bearer admin-token',
    };

    vi.mocked(authService.verifyToken).mockReturnValue(mockPayload);

    authenticate(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockRequest.user).toEqual({
      userId: 'admin123',
      email: 'admin@example.com',
      role: UserRole.ADMIN,
    });
    expect(mockNext).toHaveBeenCalledWith();
  });
});
