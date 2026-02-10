import { refreshTokenRepository } from '../repositories/refreshToken.repository';
import logger from '../middleware/logger';

/**
 * Cleanup job to delete expired refresh tokens
 * Runs daily to prevent database bloat from expired tokens
 */
export function startTokenCleanupJob(): void {
  const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

  // Run cleanup immediately on startup (for expired tokens)
  void runCleanup();

  // Schedule daily cleanup
  setInterval(() => {
    void runCleanup();
  }, CLEANUP_INTERVAL_MS);

  logger.info('Token cleanup job started - running daily');
}

/**
 * Execute the cleanup of expired tokens
 */
async function runCleanup(): Promise<void> {
  try {
    const deletedCount = await refreshTokenRepository.deleteExpired();
    logger.info(`Token cleanup completed - deleted ${deletedCount} expired refresh tokens`);
  } catch (error) {
    logger.error('Error during token cleanup', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
