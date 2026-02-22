import { Router } from 'express';
import {
  submitLead,
  getAllLeads,
  getLeadById,
  updateLeadReadStatus,
  deleteLead,
  getConfig,
  updateConfig,
} from '../controllers/calculator.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/authorize.middleware';

const router = Router();

// All calculator routes require admin (calculator is admin-only)
router.use(authenticate, requireAdmin);

// Leads
router.post('/leads', submitLead);
router.get('/leads', getAllLeads);
router.get('/leads/:id', getLeadById);
router.patch('/leads/:id/read', updateLeadReadStatus);
router.delete('/leads/:id', deleteLead);

// Config
router.get('/config', getConfig);
router.put('/config', updateConfig);

export default router;
