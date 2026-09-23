import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import type {
  ArticleResponse,
  ArticleSummaryResponse,
  ArticleFaqResponse,
} from '@shirans/shared';
import { ArticleFilters, ArticleRequest } from '../types/article.types';

type ArticleRow = Prisma.ArticleGetPayload<object>;

/** `faq` is Json in the database; anything malformed is dropped rather than thrown. */
function readFaq(value: Prisma.JsonValue): ArticleFaqResponse[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return [];
    const { question, answer } = entry as Record<string, unknown>;
    if (typeof question !== 'string' || typeof answer !== 'string') return [];
    const q = question.trim();
    const a = answer.trim();
    return q && a ? [{ question: q, answer: a }] : [];
  });
}

function transformArticle(article: ArticleRow): ArticleResponse {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    body: article.body,
    coverImage: article.coverImage,
    coverImageAlt: article.coverImageAlt,
    coverImagePublicId: article.coverImagePublicId,
    category: article.category,
    readingMinutes: article.readingMinutes,
    faq: readFaq(article.faq),
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    published: article.published,
    publishedAt: article.publishedAt?.toISOString() ?? null,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  };
}

function toSummary(article: ArticleResponse): ArticleSummaryResponse {
  const { body: _body, faq: _faq, ...summary } = article;
  return summary;
}

function whereFrom(filters?: ArticleFilters): Prisma.ArticleWhereInput {
  const where: Prisma.ArticleWhereInput = {};
  if (filters?.published !== undefined) where.published = filters.published;
  if (filters?.category) where.category = filters.category;
  return where;
}

/** Newest published first; drafts have no publishedAt, so they fall back to creation. */
const LIST_ORDER: Prisma.ArticleOrderByWithRelationInput[] = [
  { publishedAt: { sort: 'desc', nulls: 'last' } },
  { createdAt: 'desc' },
];

export const articleRepository = {
  async create(data: ArticleRequest & { slug: string; publishedAt: Date | null }) {
    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        body: data.body,
        coverImage: data.coverImage,
        coverImageAlt: data.coverImageAlt ?? null,
        coverImagePublicId: data.coverImagePublicId ?? null,
        category: data.category ?? null,
        readingMinutes: data.readingMinutes ?? 1,
        faq: (data.faq ?? []) as unknown as Prisma.InputJsonValue,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        published: data.published ?? false,
        publishedAt: data.publishedAt,
      },
    });
    return transformArticle(article);
  },

  async update(
    id: string,
    data: Partial<ArticleRequest> & { slug?: string; publishedAt?: Date | null },
  ) {
    const article = await prisma.article.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
        ...(data.body !== undefined && { body: data.body }),
        ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
        ...(data.coverImageAlt !== undefined && { coverImageAlt: data.coverImageAlt || null }),
        ...(data.coverImagePublicId !== undefined && {
          coverImagePublicId: data.coverImagePublicId || null,
        }),
        ...(data.category !== undefined && { category: data.category || null }),
        ...(data.readingMinutes !== undefined && { readingMinutes: data.readingMinutes }),
        ...(data.faq !== undefined && { faq: data.faq as unknown as Prisma.InputJsonValue }),
        ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle || null }),
        ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription || null }),
        ...(data.published !== undefined && { published: data.published }),
        ...(data.publishedAt !== undefined && { publishedAt: data.publishedAt }),
      },
    });
    return transformArticle(article);
  },

  async findAll(filters?: ArticleFilters): Promise<ArticleSummaryResponse[]> {
    const articles = await prisma.article.findMany({
      where: whereFrom(filters),
      orderBy: LIST_ORDER,
    });
    return articles.map((article) => toSummary(transformArticle(article)));
  },

  async findById(id: string): Promise<ArticleResponse | null> {
    const article = await prisma.article.findUnique({ where: { id } });
    return article ? transformArticle(article) : null;
  },

  async findBySlug(slug: string, publishedOnly: boolean): Promise<ArticleResponse | null> {
    const article = await prisma.article.findFirst({
      where: publishedOnly ? { slug, published: true } : { slug },
    });
    return article ? transformArticle(article) : null;
  },

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const row = await prisma.article.findUnique({ where: { slug }, select: { id: true } });
    return !!row && row.id !== excludeId;
  },

  async delete(id: string): Promise<void> {
    await prisma.article.delete({ where: { id } });
  },

  async bulkDelete(ids: string[]): Promise<number> {
    const { count } = await prisma.article.deleteMany({ where: { id: { in: ids } } });
    return count;
  },

  /**
   * Publishing state for many at once. `publishedAt` is only ever filled in,
   * never cleared, so unpublishing and republishing keeps the original date.
   */
  async bulkSetPublished(ids: string[], published: boolean): Promise<number> {
    if (published) {
      await prisma.article.updateMany({
        where: { id: { in: ids }, publishedAt: null },
        data: { publishedAt: new Date() },
      });
    }
    const { count } = await prisma.article.updateMany({
      where: { id: { in: ids } },
      data: { published },
    });
    return count;
  },
};
