import { Router } from 'express';
import {
  submitContact,
  getAllSubmissions,
  getSubmissionById,
  updateReadStatus,
  deleteSubmission,
} from '../controllers/contact.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/authorize.middleware';

const router = Router();

// Public route
// POST /api/contact - Submit contact form
router.post('/', submitContact);

// Protected admin routes
// GET /api/contact - Get all contact submissions
router.get('/', authenticate, requireAdmin, getAllSubmissions);

// GET /api/contact/:id - Get a contact submission by ID
router.get('/:id', authenticate, requireAdmin, getSubmissionById);

// PATCH /api/contact/:id/read - Update read status
router.patch('/:id/read', authenticate, requireAdmin, updateReadStatus);

// DELETE /api/contact/:id - Delete a contact submission
router.delete('/:id', authenticate, requireAdmin, deleteSubmission);

export default router;
