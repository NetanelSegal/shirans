import { Router } from 'express';
import { getAllUsers } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/authorize.middleware';

const router = Router();

// Protected admin routes
// GET /api/users - Get all users
router.get('/', authenticate, requireAdmin, getAllUsers);

export default router;
