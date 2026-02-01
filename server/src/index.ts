import { Server } from 'http';
import app from './app';
import { env } from './utils/env';
import { prisma } from './config/database';
import logger from './middleware/logger';

// Validate environment variables on startup
// This will throw if required variables are missing
logger.info('Environment variables validated');

// Start server
const server: Server = app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

// Graceful shutdown handler
function gracefulShutdown(signal: string): void {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  server.close(() => {
    logger.info('HTTP server closed');

    // Disconnect Prisma client
    prisma
      .$disconnect()
      .then(() => {
        logger.info('Prisma client disconnected');
        process.exit(0);
      })
      .catch((error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('Error disconnecting Prisma client', { error: errorMessage });
        process.exit(1);
      });
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Rejection', { reason });
  gracefulShutdown('unhandledRejection');
});
