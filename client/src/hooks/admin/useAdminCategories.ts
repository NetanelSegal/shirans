import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminCategoriesService from '../../services/admin/categories.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';
import { QUERY_STALE_TIME_ADMIN_MS } from '@/lib/queryClient';
import { invalidateAfterAdminCategoriesChange } from '@/lib/queryInvalidation';
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@shirans/shared';

export function useAdminCategories() {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.categories,
    queryFn: adminCategoriesService.fetchAllCategories,
    staleTime: QUERY_STALE_TIME_ADMIN_MS,
  });

  const errorMessage = error
    ? getClientErrorMessage(transformError(error).errorKey)
    : null;

  const refresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const createMutation = useMutation({
    mutationFn: adminCategoriesService.createCategory,
    onSuccess: () => invalidateAfterAdminCategoriesChange(queryClient),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      input,
    }: { id: string; input: UpdateCategoryInput }) =>
      adminCategoriesService.updateCategory(id, input),
    onSuccess: () => invalidateAfterAdminCategoriesChange(queryClient),
  });

  const deleteMutation = useMutation({
    mutationFn: adminCategoriesService.deleteCategory,
    onSuccess: () => invalidateAfterAdminCategoriesChange(queryClient),
  });

  return {
    categories,
    isLoading,
    error: errorMessage,
    refresh,
    create: (input: CreateCategoryInput) => createMutation.mutateAsync(input),
    update: (id: string, input: UpdateCategoryInput) =>
      updateMutation.mutateAsync({ id, input }),
    delete: (id: string) => deleteMutation.mutateAsync(id),
  };
}
