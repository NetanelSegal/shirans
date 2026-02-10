import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { TokenPayload } from '../types/auth.types';
import { UserRole } from '@prisma/client';

// Mock jsonwebtoken with error classes - hoisted to top
const { mockJwt, JsonWebTokenError, TokenExpiredError } = vi.hoisted(() => {
  class JsonWebTokenError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'JsonWebTokenError';
    }
  }

  class TokenExpiredError extends Error {
    constructor(message: string, expiredAt?: Date) {
      super(message);
      this.name = 'TokenExpiredError';
      (this as unknown as Record<string, unknown>).expiredAt = expiredAt;
    }
  }

  const mockJwt = {
    sign: vi.fn(),
    verify: vi.fn(),
    decode: vi.fn(),
    JsonWebTokenError,
    TokenExpiredError,
  };

  return { mockJwt, JsonWebTokenError, TokenExpiredError };
});

vi.mock('jsonwebtoken', () => ({
  default: mockJwt,
  JsonWebTokenError,
  TokenExpiredError,
}));

// Import after mocks
import jwt from 'jsonwebtoken';
import { signToken, verifyToken, decodeToken } from './jwt';
import { env } from './env';

// Mock env
vi.mock('./env', () => ({
  env: {
    JWT_SECRET: 'test-secret-key-for-jwt-testing-purposes',
    JWT_EXPIRES_IN: '1h',
  },
}));

describe('jwt utilities', () => {
  const mockPayload: TokenPayload = {
    userId: 'user123',
    email: 'test@example.com',
    role: UserRole.USER,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signToken', () => {
    it('should sign a token with correct payload and options', () => {
      const mockToken = 'mock.jwt.token';
      vi.mocked(jwt.sign).mockReturnValue(mockToken as never);

      const result = signToken(mockPayload);

      expect(result).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(mockPayload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
      });
    });

    it('should include all payload fields in token', () => {
      const mockToken = 'mock.jwt.token';
      vi.mocked(jwt.sign).mockReturnValue(mockToken as never);

      signToken(mockPayload);

      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockPayload.userId,
          email: mockPayload.email,
          role: mockPayload.role,
        }),
        expect.any(String),
        expect.any(Object)
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify and return decoded token payload', () => {
      vi.mocked(jwt.verify).mockReturnValue(mockPayload as never);

      const result = verifyToken('valid.token.here');

      expect(result).toEqual(mockPayload);
      expect(jwt.verify).toHaveBeenCalledWith(
        'valid.token.here',
        env.JWT_SECRET
      );
    });

    it('should throw generic error for JsonWebTokenError (security: prevent info disclosure)', () => {
      const error = new JsonWebTokenError('Invalid token');
      vi.mocked(jwt.verify).mockImplementation(() => {
        throw error;
      });

      expect(() => verifyToken('invalid.token')).toThrow(
        'Invalid or expired token'
      );
    });

    it('should throw generic error for TokenExpiredError (security: prevent info disclosure)', () => {
      const error = new TokenExpiredError('Token expired', new Date());
      vi.mocked(jwt.verify).mockImplementation(() => {
        throw error;
      });

      expect(() => verifyToken('expired.token')).toThrow(
        'Invalid or expired token'
      );
    });

    it('should throw generic error for other verification failures', () => {
      vi.mocked(jwt.verify).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      expect(() => verifyToken('bad.token')).toThrow(
        'Invalid or expired token'
      );
    });
  });

  describe('decodeToken', () => {
    it('should decode token without verification', () => {
      vi.mocked(jwt.decode).mockReturnValue(mockPayload as never);

      const result = decodeToken('some.token.here');

      expect(result).toEqual(mockPayload);
      expect(jwt.decode).toHaveBeenCalledWith('some.token.here');
    });

    it('should return null for invalid token', () => {
      vi.mocked(jwt.decode).mockReturnValue(null);

      const result = decodeToken('invalid.token');

      expect(result).toBeNull();
    });

    it('should return null when decode throws error', () => {
      vi.mocked(jwt.decode).mockImplementation(() => {
        throw new Error('Decode error');
      });

      const result = decodeToken('bad.token');

      expect(result).toBeNull();
    });
  });
});
