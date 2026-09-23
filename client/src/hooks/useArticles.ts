import { useQuery } from '@tanstack/react-query';
import { fetchArticleBySlug, fetchPublishedArticles } from '@/services/articles.service';
import { queryKeys } from '@/constants/queryKeys';
import type { ArticleResponse, ArticleSummaryResponse } from '@shirans/shared';

export function useArticles() {
  return useQuery<ArticleSummaryResponse[]>({
    queryKey: queryKeys.articles,
    queryFn: fetchPublishedArticles,
  });
}

export function useArticle(slug: string | undefined) {
  return useQuery<ArticleResponse>({
    queryKey: queryKeys.article(slug ?? '__none__'),
    queryFn: () => fetchArticleBySlug(slug as string),
    enabled: !!slug,
    retry: false,
  });
}
