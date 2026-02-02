import { Router } from 'express';
import {
  register,
  login,
  getCurrentUser,
  refresh,
  logout,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// POST /api/auth/register - Register new user (public)
router.post('/register', authLimiter, register);

// POST /api/auth/login - Login user (public)
router.post('/login', authLimiter, login);

// POST /api/auth/refresh - Refresh access token (public)
router.post('/refresh', authLimiter, refresh);

// GET /api/auth/me - Get current user (protected)
router.get('/me', authenticate, getCurrentUser);

// POST /api/auth/logout - Logout user (server-side token invalidation)
router.post('/logout', authLimiter, logout);

export default router;
