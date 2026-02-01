import express, { Express } from 'express';
import cors from 'cors';
import 'express-async-errors';
import { corsOptions } from './config/cors';
import { requestLogger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/health.routes';

function createApp(): Express {
  const app = express();

  // CORS middleware
  app.use(cors(corsOptions));

  // Request logging middleware
  app.use(requestLogger);

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.use('/api', healthRoutes);

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}

export default createApp();
