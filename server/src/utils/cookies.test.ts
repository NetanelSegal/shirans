import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getRefreshTokenFromCookie,
} from './cookies';
import { env } from './env';

// Mock env
vi.mock('./env', () => ({
  env: {
    COOKIE_SECURE: 'false',
    COOKIE_SAME_SITE: 'strict',
    COOKIE_DOMAIN: '',
    NODE_ENV: 'test' as const,
  },
}));

describe('cookie utilities', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset env mock to defaults
    vi.mocked(env).COOKIE_SECURE = 'false';
    vi.mocked(env).COOKIE_SAME_SITE = 'strict';
    vi.mocked(env).COOKIE_DOMAIN = '';
    vi.mocked(env).NODE_ENV = 'test';

    mockRequest = {
      cookies: {},
    };

    mockResponse = {
      cookie: vi.fn(),
      clearCookie: vi.fn(),
    };
  });

  describe('setRefreshTokenCookie', () => {
    it('should set refresh token cookie with correct options', () => {
      const token = 'test-refresh-token';
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

      setRefreshTokenCookie(mockResponse as Response, token, maxAge);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        token,
        expect.objectContaining({
          httpOnly: true,
          secure: false, // COOKIE_SECURE is 'false' and NODE_ENV is 'test'
          sameSite: 'strict',
          maxAge,
          path: '/api/auth',
          domain: undefined,
        })
      );
    });

    it('should set secure cookie in production', () => {
      vi.mocked(env).NODE_ENV = 'production';

      const token = 'test-refresh-token';
      const maxAge = 7 * 24 * 60 * 60 * 1000;

      setRefreshTokenCookie(mockResponse as Response, token, maxAge);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        token,
        expect.objectContaining({
          secure: true, // Should be true in production
        })
      );
    });

    it('should set secure cookie when COOKIE_SECURE is true', () => {
      vi.mocked(env).COOKIE_SECURE = 'true';

      const token = 'test-refresh-token';
      const maxAge = 7 * 24 * 60 * 60 * 1000;

      setRefreshTokenCookie(mockResponse as Response, token, maxAge);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        token,
        expect.objectContaining({
          secure: true,
        })
      );
    });

    it('should use custom domain when COOKIE_DOMAIN is set', () => {
      vi.mocked(env).COOKIE_DOMAIN = 'example.com';

      const token = 'test-refresh-token';
      const maxAge = 7 * 24 * 60 * 60 * 1000;

      setRefreshTokenCookie(mockResponse as Response, token, maxAge);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        token,
        expect.objectContaining({
          domain: 'example.com',
        })
      );
    });

    it('should use custom sameSite when COOKIE_SAME_SITE is set', () => {
      vi.mocked(env).COOKIE_SAME_SITE = 'lax';

      const token = 'test-refresh-token';
      const maxAge = 7 * 24 * 60 * 60 * 1000;

      setRefreshTokenCookie(mockResponse as Response, token, maxAge);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        token,
        expect.objectContaining({
          sameSite: 'lax',
        })
      );
    });
  });

  describe('clearRefreshTokenCookie', () => {
    it('should clear refresh token cookie with correct options', () => {
      clearRefreshTokenCookie(mockResponse as Response);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        'refreshToken',
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          path: '/api/auth',
          domain: undefined,
        })
      );
    });

    it('should clear cookie with secure flag in production', () => {
      vi.mocked(env).NODE_ENV = 'production';

      clearRefreshTokenCookie(mockResponse as Response);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        'refreshToken',
        expect.objectContaining({
          secure: true,
        })
      );
    });

    it('should clear cookie with custom domain when set', () => {
      vi.mocked(env).COOKIE_DOMAIN = 'example.com';

      clearRefreshTokenCookie(mockResponse as Response);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        'refreshToken',
        expect.objectContaining({
          domain: 'example.com',
        })
      );
    });
  });

  describe('getRefreshTokenFromCookie', () => {
    it('should return refresh token from cookie', () => {
      mockRequest.cookies = {
        refreshToken: 'test-refresh-token',
      };

      const result = getRefreshTokenFromCookie(mockRequest as Request);

      expect(result).toBe('test-refresh-token');
    });

    it('should return null when cookie is missing', () => {
      mockRequest.cookies = {};

      const result = getRefreshTokenFromCookie(mockRequest as Request);

      expect(result).toBeNull();
    });

    it('should return null when cookies object is undefined', () => {
      mockRequest.cookies = undefined as unknown as Record<string, string>;

      const result = getRefreshTokenFromCookie(mockRequest as Request);

      expect(result).toBeNull();
    });

    it('should return null when refreshToken cookie is empty string', () => {
      mockRequest.cookies = {
        refreshToken: '',
      };

      const result = getRefreshTokenFromCookie(mockRequest as Request);

      expect(result).toBeNull();
    });
  });
});
