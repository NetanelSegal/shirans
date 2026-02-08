import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  loginSchema,
} from './auth.schema';

describe('auth validators', () => {
  describe('registerSchema', () => {
    it('should validate valid registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
        expect(result.data.password).toBe('Password123!');
        expect(result.data.name).toBe('Test User');
      }
    });

    it('should trim and sanitize name', () => {
      const data = {
        email: 'test@example.com',
        password: 'Password123!',
        name: '  Test User  ',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Test User'); // Name trimming works
      }
    });

    it('should trim and sanitize email before validation', () => {
      // Email is trimmed before validation, so spaces are removed and email passes
      const data = {
        email: '  test@example.com  ', // Email with spaces that should be trimmed
        password: 'Password123!',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
      }
    });

    it('should trim and sanitize name', () => {
      const data = {
        email: 'test@example.com',
        password: 'Password123!',
        name: '  Test User  ',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Test User');
      }
    });

    it('should reject invalid email format', () => {
      const data = {
        email: 'invalid-email',
        password: 'Password123!',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject email that is too long', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      const data = {
        email: longEmail,
        password: 'Password123!',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject password without uppercase letter', () => {
      const data = {
        email: 'test@example.com',
        password: 'password123!',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject password without lowercase letter', () => {
      const data = {
        email: 'test@example.com',
        password: 'PASSWORD123!',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject password without number', () => {
      const data = {
        email: 'test@example.com',
        password: 'Password!',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject password without special character', () => {
      const data = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject password shorter than 8 characters', () => {
      const data = {
        email: 'test@example.com',
        password: 'Pass1!',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject password longer than 100 characters', () => {
      const longPassword = 'A'.repeat(101) + '1!';
      const data = {
        email: 'test@example.com',
        password: longPassword,
        name: 'Test User',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject name shorter than 2 characters', () => {
      const data = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'A',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject name longer than 100 characters', () => {
      const longName = 'A'.repeat(101);
      const data = {
        email: 'test@example.com',
        password: 'Password123!',
        name: longName,
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject missing email', () => {
      const data = {
        password: 'Password123!',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const data = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject missing name', () => {
      const data = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should validate valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const result = loginSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
        expect(result.data.password).toBe('Password123!');
      }
    });

    it('should trim and sanitize email before validation', () => {
      // Email is trimmed before validation, so spaces are removed and email passes
      const data = {
        email: '  test@example.com  ', // Email with spaces that should be trimmed
        password: 'Password123!',
      };

      const result = loginSchema.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
      }
    });

    it('should reject invalid email format', () => {
      const data = {
        email: 'invalid-email',
        password: 'Password123!',
      };

      const result = loginSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject password shorter than 8 characters', () => {
      const data = {
        email: 'test@example.com',
        password: 'Pass1!',
      };

      const result = loginSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should accept password without complexity requirements (login is lenient)', () => {
      const data = {
        email: 'test@example.com',
        password: 'password123', // No uppercase or special char, but >= 8 chars
      };

      const result = loginSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it('should reject missing email', () => {
      const data = {
        password: 'Password123!',
      };

      const result = loginSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const data = {
        email: 'test@example.com',
      };

      const result = loginSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const data = {
        email: 'test@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(data);

      expect(result.success).toBe(false);
    });
  });
});
