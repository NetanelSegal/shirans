import { Router } from 'express';
import {
  submitLead,
  getAllLeads,
  getLeadById,
  updateLeadReadStatus,
  deleteLead,
  bulkUpdateLeadReadStatus,
  bulkDeleteLeads,
  getConfig,
  updateConfig,
} from '../controllers/calculator.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/authorize.middleware';
import { leadLimiter, adminMutationLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes (no auth)
router.post('/leads', leadLimiter, submitLead);
router.get('/config', getConfig);

// Protected admin routes
router.get('/leads', authenticate, requireAdmin, getAllLeads);
router.patch('/leads/bulk/read', adminMutationLimiter, authenticate, requireAdmin, bulkUpdateLeadReadStatus);
router.delete('/leads/bulk', adminMutationLimiter, authenticate, requireAdmin, bulkDeleteLeads);
router.get('/leads/:id', authenticate, requireAdmin, getLeadById);
router.patch('/leads/:id/read', adminMutationLimiter, authenticate, requireAdmin, updateLeadReadStatus);
router.delete('/leads/:id', adminMutationLimiter, authenticate, requireAdmin, deleteLead);
router.put('/config', adminMutationLimiter, authenticate, requireAdmin, updateConfig);

export default router;
