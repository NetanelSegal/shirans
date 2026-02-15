import { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/authorize.middleware';

const router = Router();

// Public routes
// GET /api/categories - Get all categories
router.get('/', getAllCategories);

// GET /api/categories/:id - Get a category by ID
router.get('/:id', getCategoryById);

// Protected admin routes
// POST /api/categories - Create a new category
router.post('/', authenticate, requireAdmin, createCategory);

// PUT /api/categories/:id - Update a category
router.put('/:id', authenticate, requireAdmin, updateCategory);

// DELETE /api/categories/:id - Delete a category
router.delete('/:id', authenticate, requireAdmin, deleteCategory);

export default router;
