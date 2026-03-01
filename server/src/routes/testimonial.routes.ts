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
import { adminMutationLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes
router.get('/', getAllTestimonials); // Can be filtered by ?isPublished=true/false
router.get('/published', getPublishedTestimonials);

// Protected admin routes
router.post('/', adminMutationLimiter, authenticate, requireAdmin, createTestimonial);
router.get('/:id', authenticate, requireAdmin, getTestimonialById);
router.put('/:id', adminMutationLimiter, authenticate, requireAdmin, updateTestimonial);
router.delete('/:id', adminMutationLimiter, authenticate, requireAdmin, deleteTestimonial);
router.patch('/:id/order', adminMutationLimiter, authenticate, requireAdmin, updateTestimonialOrder);

export default router;
