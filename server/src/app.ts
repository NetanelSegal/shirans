import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import { corsOptions } from './config/cors';
import { requestLogger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/health.routes';
import projectRoutes from './routes/project.routes';
import authRoutes from './routes/auth.routes';

function createApp(): Express {
  const app = express();

  // CORS middleware
  app.use(cors(corsOptions));

  // Request logging middleware
  app.use(requestLogger);

  // Cookie parsing middleware
  app.use(cookieParser());

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.use('/api', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}

export default createApp();
