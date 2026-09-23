import apiClient from '../utils/apiClient';
import { urls } from '../constants/urls';
import type { ArticleResponse, ArticleSummaryResponse } from '@shirans/shared';

/**
 * The public reads. Unlike projects and testimonials these have no file
 * fallback: an article only exists once Shiran writes it, so an empty list is
 * the honest answer when the API is unreachable.
 */

export async function fetchPublishedArticles(): Promise<ArticleSummaryResponse[]> {
  const { data } = await apiClient.get<ArticleSummaryResponse[]>(urls.articles.published);
  return data;
}

export async function fetchArticleBySlug(slug: string): Promise<ArticleResponse> {
  const { data } = await apiClient.get<ArticleResponse>(urls.articles.bySlug(slug));
  return data;
}
