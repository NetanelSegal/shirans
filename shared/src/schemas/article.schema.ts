import { z } from 'zod';

/**
 * Articles — the knowledge centre ("מרכז הידע").
 *
 * `body` and `excerpt` are HTML produced by the admin's editor. The server
 * sanitises both before they are stored; nothing here trusts the client.
 */

/** Categories an article can be filed under. Adding one starts here. */
export const ARTICLE_CATEGORIES = [
  'תכנון ובנייה',
  'עיצוב פנים',
  'רישוי והיתרים',
  'תקציב ועלויות',
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

/** One question and its answer, rendered as an accordion and as FAQPage JSON-LD. */
export const articleFaqItemSchema = z.object({
  question: z.string().trim().min(1, 'Question is required').max(300),
  answer: z.string().trim().min(1, 'Answer is required').max(2000),
});

export const createArticleSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(200),
  /** Left empty, the server derives it from the title. */
  slug: z.string().trim().max(120).optional(),
  excerpt: z.string().trim().min(10, 'Excerpt must be at least 10 characters').max(600),
  body: z.string().min(1, 'Body is required').max(60000),
  coverImage: z.string().trim().url('Cover image must be a URL').max(2000),
  coverImageAlt: z.string().trim().max(300).optional(),
  coverImagePublicId: z.string().trim().max(300).optional(),
  category: z.enum(ARTICLE_CATEGORIES).optional(),
  /** Minutes. Left empty, the server estimates it from the body. */
  readingMinutes: z.number().int().positive().max(120).optional(),
  faq: z.array(articleFaqItemSchema).max(20).optional().default([]),
  /** Overrides the <title> tag; falls back to the article title. */
  seoTitle: z.string().trim().max(200).optional(),
  /** Overrides the meta description; falls back to the excerpt. */
  seoDescription: z.string().trim().max(300).optional(),
  published: z.boolean().optional().default(false),
});

export const updateArticleSchema = createArticleSchema.partial().extend({
  id: z.string().cuid('Invalid article ID format'),
});

export const articleIdSchema = z.object({
  id: z.string().cuid('Invalid article ID format'),
});

export const articleSlugSchema = z.object({
  slug: z.string().trim().min(1).max(120),
});

export const articleQuerySchema = z.object({
  published: z.enum(['true', 'false']).optional(),
  category: z.enum(ARTICLE_CATEGORIES).optional(),
});

export const articleBulkIdsSchema = z.object({
  ids: z.array(z.string().cuid('Invalid article ID format')).min(1, 'At least one ID required'),
});

export const articleBulkUpdateSchema = articleBulkIdsSchema.extend({
  published: z.boolean().optional(),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type ArticleIdInput = z.infer<typeof articleIdSchema>;
export type ArticleSlugInput = z.infer<typeof articleSlugSchema>;
export type ArticleQueryInput = z.infer<typeof articleQuerySchema>;
export type ArticleFaqItem = z.infer<typeof articleFaqItemSchema>;
