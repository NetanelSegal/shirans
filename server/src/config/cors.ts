import { CorsOptions } from 'cors';
import { env } from '../utils/env';

export const corsOptions: CorsOptions = {
  origin: [env.CORS_ORIGIN, 'http://localhost:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
