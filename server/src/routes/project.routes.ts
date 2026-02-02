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
} from '../controllers/project.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/authorize.middleware';

const router = Router();

// Public routes (no authentication required)
// GET /api/projects - Get all projects with optional filters
router.get('/', getAllProjects);

// GET /api/projects/favourites - Get all favourite projects
router.get('/favourites', getFavouriteProjects);

// GET /api/projects/single - Get single project by ID (query param: ?id=xxx)
router.get('/single', getProjectById);

// Protected admin routes (require authentication and ADMIN role)
// POST /api/projects - Create a new project
router.post('/', authenticate, requireAdmin, createProject);

// PUT /api/projects - Update project (body contains id)
router.put('/', authenticate, requireAdmin, updateProject);

// DELETE /api/projects - Delete a project (body contains id)
router.delete('/', authenticate, requireAdmin, deleteProject);

// POST /api/projects/uploadImgs - Upload images to project
router.post('/uploadImgs', authenticate, requireAdmin, uploadProjectImages);

// DELETE /api/projects/deleteMainImage - Delete main image from project
router.delete('/deleteMainImage', authenticate, requireAdmin, deleteMainImage);

// DELETE /api/projects/deleteImages - Delete specific images from project
router.delete('/deleteImages', authenticate, requireAdmin, deleteProjectImages);

export default router;
