import { Router } from 'express';
import {
  createProject,
  getAllProjects,
  getFavouriteProjects,
  getProjectById,
  updateProject,
  uploadProjectImages,
  deleteProject,
  deleteMainImage,
  deleteProjectImages,
  reorderProjectImages,
} from '../controllers/project.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/authorize.middleware';
import { adminMutationLimiter } from '../middleware/rateLimiter';
import { uploadImages } from '../middleware/upload';

const router = Router();

// Public routes (no authentication required)
router.get('/', getAllProjects);
router.get('/favourites', getFavouriteProjects);
router.get('/single', getProjectById);

// Protected admin routes (require authentication and ADMIN role)
router.post('/', adminMutationLimiter, authenticate, requireAdmin, createProject);
router.put('/', adminMutationLimiter, authenticate, requireAdmin, updateProject);
router.delete('/', adminMutationLimiter, authenticate, requireAdmin, deleteProject);

// Image management (admin only)
router.post('/uploadImgs', adminMutationLimiter, authenticate, requireAdmin, uploadImages, uploadProjectImages);
router.delete('/deleteMainImage', adminMutationLimiter, authenticate, requireAdmin, deleteMainImage);
router.delete('/deleteImages', adminMutationLimiter, authenticate, requireAdmin, deleteProjectImages);
router.patch('/reorderImages', adminMutationLimiter, authenticate, requireAdmin, reorderProjectImages);

export default router;
