import { Request, Response } from 'express';
import { articleService } from '../services/article.service';
import { validateRequest } from '../utils/validation';
import {
  createArticleSchema,
  updateArticleSchema,
  articleIdSchema,
  articleSlugSchema,
  articleQuerySchema,
  articleBulkIdsSchema,
  articleBulkUpdateSchema,
} from '@shirans/shared';
import { HTTP_STATUS } from '../constants/httpStatus';
import { HttpError } from '../middleware/errorHandler';
import { getServerErrorMessage } from '@/constants/errorMessages';
import { uploadImage } from '../services/cloudinary.service';
import { compressImageBuffer } from '../utils/imageProcessing';

const toBool = (value?: string) =>
  value === 'true' ? true : value === 'false' ? false : undefined;

export const createArticle = async (req: Request, res: Response) => {
  const data = validateRequest(createArticleSchema, req.body);
  const article = await articleService.createArticle(data);
  res.status(HTTP_STATUS.CREATED).json(article);
};

export const getAllArticles = async (req: Request, res: Response) => {
  const query = validateRequest(articleQuerySchema, req.query);
  const articles = await articleService.getAllArticles({
    published: toBool(query.published),
    category: query.category,
  });
  res.status(HTTP_STATUS.OK).json(articles);
};

export const getPublishedArticles = async (_: Request, res: Response) => {
  const articles = await articleService.getPublishedArticles();
  res.status(HTTP_STATUS.OK).json(articles);
};

/** The public read, by slug — drafts are never served here. */
export const getArticleBySlug = async (req: Request, res: Response) => {
  const { slug } = validateRequest(articleSlugSchema, req.params);
  const article = await articleService.getPublishedArticleBySlug(slug);
  res.status(HTTP_STATUS.OK).json(article);
};

export const getArticleById = async (req: Request, res: Response) => {
  const { id } = validateRequest(articleIdSchema, req.params);
  const article = await articleService.getArticleById(id);
  res.status(HTTP_STATUS.OK).json(article);
};

export const updateArticle = async (req: Request, res: Response) => {
  const { id } = validateRequest(articleIdSchema, req.params);
  const { id: _ignored, ...data } = validateRequest(updateArticleSchema, {
    ...req.body,
    id,
  });
  const article = await articleService.updateArticle(id, data);
  res.status(HTTP_STATUS.OK).json(article);
};

export const deleteArticle = async (req: Request, res: Response) => {
  const { id } = validateRequest(articleIdSchema, req.params);
  const result = await articleService.deleteArticle(id);
  res.status(HTTP_STATUS.OK).json(result);
};

export const bulkDeleteArticles = async (req: Request, res: Response) => {
  const { ids } = validateRequest(articleBulkIdsSchema, req.body);
  const result = await articleService.bulkDeleteArticles(ids);
  res.status(HTTP_STATUS.OK).json(result);
};

export const bulkUpdateArticles = async (req: Request, res: Response) => {
  const { ids, published } = validateRequest(articleBulkUpdateSchema, req.body);
  if (published === undefined) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Nothing to update' });
    return;
  }
  const result = await articleService.bulkSetPublished(ids, published);
  res.status(HTTP_STATUS.OK).json(result);
};

/**
 * One image for an article — the cover, or a picture dropped into the body.
 * Articles are written before they have an id, so unlike project media these
 * land in a flat folder rather than one per record.
 */
export const uploadArticleImage = async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  const file = files[0];
  if (!file) {
    throw new HttpError(
      HTTP_STATUS.BAD_REQUEST,
      getServerErrorMessage('VALIDATION.NO_IMAGE_SUPPLIED'),
    );
  }
  const compressed = await compressImageBuffer(file.buffer);
  const result = await uploadImage(compressed, 'shirans/articles');
  res.status(HTTP_STATUS.CREATED).json(result);
};
