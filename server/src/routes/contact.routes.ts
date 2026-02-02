import { Router } from 'express';
import {
  submitContact,
  getAllSubmissions,
  getSubmissionById,
  updateReadStatus,
  deleteSubmission,
} from '../controllers/contact.controller';
// TODO: Add auth middleware when authentication is implemented
// import { authenticate } from '../middleware/auth.middleware';
// import { requireAdmin } from '../middleware/authorize.middleware';

const router = Router();

// Public route
// POST /api/contact - Submit contact form
router.post('/', submitContact);

// Protected admin routes (TODO: Add auth middleware)
// GET /api/contact - Get all contact submissions
router.get('/', getAllSubmissions);
// TODO: router.get('/', authenticate, requireAdmin, getAllSubmissions);

// GET /api/contact/:id - Get a contact submission by ID
router.get('/:id', getSubmissionById);
// TODO: router.get('/:id', authenticate, requireAdmin, getSubmissionById);

// PATCH /api/contact/:id/read - Update read status
router.patch('/:id/read', updateReadStatus);
// TODO: router.patch('/:id/read', authenticate, requireAdmin, updateReadStatus);

// DELETE /api/contact/:id - Delete a contact submission
router.delete('/:id', deleteSubmission);
// TODO: router.delete('/:id', authenticate, requireAdmin, deleteSubmission);

export default router;
