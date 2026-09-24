import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminArticlesService from '../../services/admin/articles.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';
import { QUERY_STALE_TIME_ADMIN_MS } from '@/lib/queryClient';
import { invalidateAfterAdminArticlesChange } from '@/lib/queryInvalidation';
import type { CreateArticleInput } from '@shirans/shared';

export function useAdminArticles() {
  const queryClient = useQueryClient();

  const {
    data: articles = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.articles,
    queryFn: adminArticlesService.fetchAllArticles,
    staleTime: QUERY_STALE_TIME_ADMIN_MS,
  });

  const errorMessage = error
    ? getClientErrorMessage(transformError(error).errorKey)
    : null;

  const refresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const createMutation = useMutation({
    mutationFn: adminArticlesService.createArticle,
    onSuccess: () => invalidateAfterAdminArticlesChange(queryClient),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CreateArticleInput> }) =>
      adminArticlesService.updateArticle(id, input),
    onSuccess: () => invalidateAfterAdminArticlesChange(queryClient),
  });

  const deleteMutation = useMutation({
    mutationFn: adminArticlesService.deleteArticle,
    onSuccess: () => invalidateAfterAdminArticlesChange(queryClient),
  });

  const updateBulkMutation = useMutation({
    mutationFn: ({ ids, published }: { ids: string[]; published: boolean }) =>
      adminArticlesService.updateArticlesBulk(ids, published),
    onSuccess: () => invalidateAfterAdminArticlesChange(queryClient),
  });

  const deleteBulkMutation = useMutation({
    mutationFn: adminArticlesService.deleteArticlesBulk,
    onSuccess: () => invalidateAfterAdminArticlesChange(queryClient),
  });

  const isMutationPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    updateBulkMutation.isPending ||
    deleteBulkMutation.isPending;

  return {
    articles,
    isLoading,
    error: errorMessage,
    refresh,
    isMutationPending,
    create: (input: CreateArticleInput) => createMutation.mutateAsync(input),
    update: (id: string, input: Partial<CreateArticleInput>) =>
      updateMutation.mutateAsync({ id, input }),
    delete: (id: string) => deleteMutation.mutateAsync(id),
    updateBulk: (ids: string[], published: boolean) =>
      updateBulkMutation.mutateAsync({ ids, published }),
    deleteBulk: (ids: string[]) => deleteBulkMutation.mutateAsync(ids),
  };
}
