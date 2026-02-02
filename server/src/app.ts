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
import categoryRoutes from './routes/category.routes';
import contactRoutes from './routes/contact.routes';

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
  app.use('/api/categories', categoryRoutes);
  app.use('/api/contact', contactRoutes);

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}

export default createApp();
