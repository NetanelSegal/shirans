import { describe, it, expect } from 'vitest';
import { refreshTokenSchema } from './auth.validators';

describe('refreshTokenSchema', () => {
  it('should validate valid refresh token', () => {
    const validData = {
      refreshToken: 'a'.repeat(64), // 64 character token
    };

    const result = refreshTokenSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.refreshToken).toBe('a'.repeat(64));
    }
  });

  it('should reject missing refresh token', () => {
    const data = {};

    const result = refreshTokenSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  it('should reject empty refresh token', () => {
    const data = {
      refreshToken: '',
    };

    const result = refreshTokenSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  it('should reject refresh token that is too long', () => {
    const longToken = 'a'.repeat(129); // Exceeds REFRESH_TOKEN_MAX_LENGTH (128)
    const data = {
      refreshToken: longToken,
    };

    const result = refreshTokenSchema.safeParse(data);

    expect(result.success).toBe(false);
  });
});
