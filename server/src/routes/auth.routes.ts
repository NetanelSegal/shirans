import { Router } from 'express';
import {
  register,
  login,
  getCurrentUser,
  logout,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// POST /api/auth/register - Register new user (public)
router.post('/register', authLimiter, register);

// POST /api/auth/login - Login user (public)
router.post('/login', authLimiter, login);

// GET /api/auth/me - Get current user (protected)
router.get('/me', authenticate, getCurrentUser);

// POST /api/auth/logout - Logout user (client-side token removal)
router.post('/logout', logout);

export default router;
