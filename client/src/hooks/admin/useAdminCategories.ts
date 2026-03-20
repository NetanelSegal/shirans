import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminCategoriesService from '../../services/admin/categories.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@shirans/shared';

const ONE_MIN = 60 * 1000;

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
    staleTime: ONE_MIN,
  });

  const errorMessage = error
    ? getClientErrorMessage(transformError(error).errorKey)
    : null;

  const createMutation = useMutation({
    mutationFn: adminCategoriesService.createCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.categories,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      input,
    }: { id: string; input: UpdateCategoryInput }) =>
      adminCategoriesService.updateCategory(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.categories,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminCategoriesService.deleteCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.categories,
      });
    },
  });

  return {
    categories,
    isLoading,
    error: errorMessage,
    refresh: () => void refetch(),
    create: (input: CreateCategoryInput) => createMutation.mutateAsync(input),
    update: (id: string, input: UpdateCategoryInput) =>
      updateMutation.mutateAsync({ id, input }),
    delete: (id: string) => deleteMutation.mutateAsync(id),
  };
}
