import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { requireAdmin, requireAuth } from './authorize.middleware';
import { UserRole } from '../../prisma/generated/prisma/enums';

describe('authorize middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    mockRequest = {
      user: undefined,
    };

    mockResponse = {};

    mockNext = vi.fn();
  });

  describe('requireAdmin', () => {
    it('should allow ADMIN user to proceed', () => {
      mockRequest.user = {
        userId: 'admin123',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
      };

      requireAdmin(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should return 403 when user is not ADMIN', () => {
      mockRequest.user = {
        userId: 'user123',
        email: 'user@example.com',
        role: UserRole.USER,
      };

      requireAdmin(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 403,
          message: 'Admin access required',
        })
      );
    });

    it('should return 401 when user is not authenticated', () => {
      mockRequest.user = undefined;

      requireAdmin(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          message: 'Authentication required',
        })
      );
    });

    it('should return 401 when user is null', () => {
      mockRequest.user = null as unknown as Request['user'];

      requireAdmin(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          message: 'Authentication required',
        })
      );
    });
  });

  describe('requireAuth', () => {
    it('should allow authenticated USER to proceed', () => {
      mockRequest.user = {
        userId: 'user123',
        email: 'user@example.com',
        role: UserRole.USER,
      };

      requireAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should allow authenticated ADMIN to proceed', () => {
      mockRequest.user = {
        userId: 'admin123',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
      };

      requireAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should return 401 when user is not authenticated', () => {
      mockRequest.user = undefined;

      requireAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          message: 'Authentication required',
        })
      );
    });

    it('should return 401 when user is null', () => {
      mockRequest.user = null as unknown as Request['user'];

      requireAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          message: 'Authentication required',
        })
      );
    });
  });
});
