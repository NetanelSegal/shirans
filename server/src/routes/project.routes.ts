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

const router = Router();

// POST /api/projects - Create a new project
router.post('/', createProject);

// GET /api/projects - Get all projects with optional filters
router.get('/', getAllProjects);

// GET /api/projects/favourites - Get all favourite projects
router.get('/favourites', getFavouriteProjects);

// GET /api/projects/single - Get single project by ID (query param: ?id=xxx)
router.get('/single', getProjectById);

// PUT /api/projects - Update project (body contains id)
router.put('/', updateProject);

// DELETE /api/projects - Delete a project (body contains id)
router.delete('/', deleteProject);

// POST /api/projects/uploadImgs - Upload images to project
router.post('/uploadImgs', uploadProjectImages);

// DELETE /api/projects/deleteMainImage - Delete main image from project
router.delete('/deleteMainImage', deleteMainImage);

// DELETE /api/projects/deleteImages - Delete specific images from project
router.delete('/deleteImages', deleteProjectImages);

export default router;
