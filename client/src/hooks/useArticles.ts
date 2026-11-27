import { useQuery } from '@tanstack/react-query';
import { fetchArticleBySlug, fetchPublishedArticles } from '@/services/articles.service';
import { queryKeys } from '@/constants/queryKeys';
import { BUILTIN_ARTICLES, getBuiltinArticle, withBuiltinArticles } from '@/data/builtin-articles';
import type { ArticleResponse, ArticleSummaryResponse } from '@shirans/shared';

/** Articles from the admin, plus the few that live in code (data/builtin-articles.ts). */
export function useArticles() {
  return useQuery<ArticleSummaryResponse[]>({
    queryKey: queryKeys.articles,
    queryFn: async () => {
      const fromApi = await fetchPublishedArticles().catch(() => []);
      return withBuiltinArticles<ArticleSummaryResponse>(fromApi, BUILTIN_ARTICLES);
    },
  });
}

export function useArticle(slug: string | undefined) {
  return useQuery<ArticleResponse>({
    queryKey: queryKeys.article(slug ?? '__none__'),
    queryFn: async () => {
      const builtin = getBuiltinArticle(slug);
      if (builtin) {
        // The admin's copy wins once one is published under the same slug.
        return fetchArticleBySlug(builtin.slug).catch(() => builtin);
      }
      return fetchArticleBySlug(slug as string);
    },
    enabled: !!slug,
    retry: false,
  });
}
