import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';
import { hashPassword, comparePassword } from './password';
import { env } from './env';

// Mock bcrypt
vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

// Mock env
vi.mock('./env', () => ({
  env: {
    BCRYPT_SALT_ROUNDS: 12,
  },
}));

describe('password utilities', () => {
  const plainPassword = 'TestPassword123!';
  const hashedPassword = '$2b$12$hashedpasswordstringhere';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash password with correct salt rounds', async () => {
      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never);

      const result = await hashPassword(plainPassword);

      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, env.BCRYPT_SALT_ROUNDS);
    });

    it('should use configured salt rounds from env', async () => {
      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never);

      await hashPassword(plainPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith(
        plainPassword,
        env.BCRYPT_SALT_ROUNDS
      );
    });

    it('should return hashed password string', async () => {
      const mockHash = '$2b$12$anotherhashedpassword';
      vi.mocked(bcrypt.hash).mockResolvedValue(mockHash as never);

      const result = await hashPassword(plainPassword);

      expect(result).toBe(mockHash);
      expect(typeof result).toBe('string');
    });
  });

  describe('comparePassword', () => {
    it('should return true when passwords match', async () => {
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      const result = await comparePassword(plainPassword, hashedPassword);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    });

    it('should return false when passwords do not match', async () => {
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      const result = await comparePassword('WrongPassword', hashedPassword);

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith('WrongPassword', hashedPassword);
    });

    it('should handle empty password comparison', async () => {
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      const result = await comparePassword('', hashedPassword);

      expect(result).toBe(false);
    });

    it('should handle empty hash comparison', async () => {
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      const result = await comparePassword(plainPassword, '');

      expect(result).toBe(false);
    });
  });

  describe('integration behavior', () => {
    it('should hash and compare passwords correctly', async () => {
      // Simulate real bcrypt behavior
      const mockHash = '$2b$12$mockedhashvalue';
      vi.mocked(bcrypt.hash).mockResolvedValue(mockHash as never);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      const hash = await hashPassword(plainPassword);
      const matches = await comparePassword(plainPassword, hash);

      expect(hash).toBe(mockHash);
      expect(matches).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, mockHash);
    });
  });
});
