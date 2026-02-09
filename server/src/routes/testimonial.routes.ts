import { Router } from 'express';
import {
  createTestimonial,
  getAllTestimonials,
  getPublishedTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  updateTestimonialOrder,
} from '../controllers/testimonial.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/authorize.middleware';

const router = Router();

// Public routes
router.get('/', getAllTestimonials); // Can be filtered by ?isPublished=true/false
router.get('/published', getPublishedTestimonials);

// Protected admin routes
router.post('/', authenticate, requireAdmin, createTestimonial);
router.get('/:id', authenticate, requireAdmin, getTestimonialById);
router.put('/:id', authenticate, requireAdmin, updateTestimonial);
router.delete('/:id', authenticate, requireAdmin, deleteTestimonial);
router.patch('/:id/order', authenticate, requireAdmin, updateTestimonialOrder);

export default router;
