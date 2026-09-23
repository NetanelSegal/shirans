import { Router } from 'express';
import {
  createArticle,
  getAllArticles,
  getPublishedArticles,
  getArticleBySlug,
  getArticleById,
  updateArticle,
  deleteArticle,
  bulkDeleteArticles,
  bulkUpdateArticles,
  uploadArticleImage,
} from '../controllers/article.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/authorize.middleware';
import { adminMutationLimiter } from '../middleware/rateLimiter';
import { uploadImages } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/published', getPublishedArticles);
router.get('/slug/:slug', getArticleBySlug);

// Protected admin routes. `/` lists drafts too, so it is not public.
router.get('/', authenticate, requireAdmin, getAllArticles);
router.post('/images', adminMutationLimiter, authenticate, requireAdmin, uploadImages, uploadArticleImage);
router.post('/', adminMutationLimiter, authenticate, requireAdmin, createArticle);
router.patch('/bulk', adminMutationLimiter, authenticate, requireAdmin, bulkUpdateArticles);
router.delete('/bulk', adminMutationLimiter, authenticate, requireAdmin, bulkDeleteArticles);
router.get('/:id', authenticate, requireAdmin, getArticleById);
router.put('/:id', adminMutationLimiter, authenticate, requireAdmin, updateArticle);
router.delete('/:id', adminMutationLimiter, authenticate, requireAdmin, deleteArticle);

export default router;
