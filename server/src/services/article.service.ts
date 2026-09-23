import { articleRepository } from '../repositories/article.repository';
import { ArticleFilters, ArticleRequest } from '../types/article.types';
import { HttpError } from '../middleware/errorHandler';
import { HTTP_STATUS } from '../constants/httpStatus';
import { getServerErrorMessage } from '@/constants/errorMessages';
import logger from '../middleware/logger';
import { estimateReadingMinutes, slugify, uniqueSlug } from '../utils/slug';
import { sanitizeArticleHtml } from '../utils/sanitizeHtml';
import { triggerSiteRebuild } from './siteRebuild.service';

/** Both HTML fields are sanitised once, here, before anything is stored. */
function cleanHtml<T extends { body?: string; excerpt?: string }>(data: T): T {
  return {
    ...data,
    ...(data.body !== undefined && { body: sanitizeArticleHtml(data.body) }),
    ...(data.excerpt !== undefined && { excerpt: sanitizeArticleHtml(data.excerpt) }),
  };
}

async function resolveSlug(source: string, excludeId?: string): Promise<string> {
  const base = slugify(source);
  if (!base) {
    throw new HttpError(
      HTTP_STATUS.BAD_REQUEST,
      getServerErrorMessage('SERVER.ARTICLE.SLUG_FAILED'),
    );
  }
  return uniqueSlug(base, (candidate) => articleRepository.slugExists(candidate, excludeId));
}

export const articleService = {
  async createArticle(data: ArticleRequest) {
    const clean = cleanHtml(data);
    const slug = await resolveSlug(clean.slug || clean.title);
    const published = clean.published ?? false;

    try {
      const article = await articleRepository.create({
        ...clean,
        slug,
        readingMinutes: clean.readingMinutes ?? estimateReadingMinutes(clean.body),
        publishedAt: published ? new Date() : null,
      });
      if (published) triggerSiteRebuild(`Article published: ${article.title}`);
      return article;
    } catch (error) {
      logger.error('Failed to create article', { error });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.ARTICLE.CREATE_FAILED'),
      );
    }
  },

  async updateArticle(id: string, data: Partial<ArticleRequest>) {
    const current = await articleRepository.findById(id);
    if (!current) {
      throw new HttpError(
        HTTP_STATUS.NOT_FOUND,
        getServerErrorMessage('NOT_FOUND.ARTICLE_NOT_FOUND'),
      );
    }

    const clean = cleanHtml(data);
    const slugSource = clean.slug || clean.title;
    const slug = slugSource ? await resolveSlug(slugSource, id) : undefined;

    const willPublish = clean.published ?? current.published;
    // Only ever filled in — a later edit must not move a date readers have seen.
    const publishedAt =
      willPublish && !current.publishedAt ? new Date() : undefined;

    try {
      const article = await articleRepository.update(id, {
        ...clean,
        ...(slug && { slug }),
        ...(clean.body !== undefined &&
          clean.readingMinutes === undefined && {
            readingMinutes: estimateReadingMinutes(clean.body),
          }),
        ...(publishedAt !== undefined && { publishedAt }),
      });
      // Rebuild whenever the published version could have changed.
      if (willPublish || current.published) {
        triggerSiteRebuild(`Article updated: ${article.title}`);
      }
      return article;
    } catch (error) {
      logger.error('Failed to update article', { error, id });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.ARTICLE.UPDATE_FAILED'),
      );
    }
  },

  async getAllArticles(filters?: ArticleFilters) {
    try {
      return await articleRepository.findAll(filters);
    } catch (error) {
      logger.error('Failed to fetch articles', { error });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.ARTICLE.FETCHS_FAILED'),
      );
    }
  },

  async getPublishedArticles() {
    return this.getAllArticles({ published: true });
  },

  async getArticleById(id: string) {
    const article = await articleRepository.findById(id);
    if (!article) {
      throw new HttpError(
        HTTP_STATUS.NOT_FOUND,
        getServerErrorMessage('NOT_FOUND.ARTICLE_NOT_FOUND'),
      );
    }
    return article;
  },

  /** The public read: drafts are invisible here, whoever asks. */
  async getPublishedArticleBySlug(slug: string) {
    const article = await articleRepository.findBySlug(slug, true);
    if (!article) {
      throw new HttpError(
        HTTP_STATUS.NOT_FOUND,
        getServerErrorMessage('NOT_FOUND.ARTICLE_NOT_FOUND'),
      );
    }
    return article;
  },

  async deleteArticle(id: string) {
    const article = await articleRepository.findById(id);
    if (!article) {
      throw new HttpError(
        HTTP_STATUS.NOT_FOUND,
        getServerErrorMessage('NOT_FOUND.ARTICLE_NOT_FOUND'),
      );
    }
    try {
      await articleRepository.delete(id);
      if (article.published) triggerSiteRebuild(`Article deleted: ${article.title}`);
      return { message: 'Article deleted' };
    } catch (error) {
      logger.error('Failed to delete article', { error, id });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.ARTICLE.DELETE_FAILED'),
      );
    }
  },

  async bulkDeleteArticles(ids: string[]) {
    try {
      const count = await articleRepository.bulkDelete(ids);
      triggerSiteRebuild(`${count} article(s) deleted`);
      return { count };
    } catch (error) {
      logger.error('Failed to bulk delete articles', { error });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.ARTICLE.DELETE_FAILED'),
      );
    }
  },

  async bulkSetPublished(ids: string[], published: boolean) {
    try {
      const count = await articleRepository.bulkSetPublished(ids, published);
      triggerSiteRebuild(`${count} article(s) ${published ? 'published' : 'unpublished'}`);
      return { count };
    } catch (error) {
      logger.error('Failed to bulk update articles', { error });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.ARTICLE.UPDATE_FAILED'),
      );
    }
  },
};
