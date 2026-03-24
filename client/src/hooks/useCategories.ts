import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/services/categories.service';
import { queryKeys } from '@/constants/queryKeys';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import type { CategoryResponse } from '@shirans/shared';

function categoriesToMap(data: CategoryResponse[] | undefined): Record<string, string> {
  const map: Record<string, string> = {};
  if (data) {
    for (const cat of data) {
      map[cat.urlCode] = cat.title;
    }
  }
  return map;
}

export function useCategories() {
  const { data, isLoading, error, refetch } = useQuery<CategoryResponse[]>({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
  });

  const errorMessage = error
    ? getClientErrorMessage(transformError(error).errorKey)
    : null;

  const retry = useCallback(() => {
    void refetch();
  }, [refetch]);

  return {
    categories: data ?? [],
    isLoading,
    error: errorMessage,
    retry,
  };
}

export function useCategoriesMap() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
    select: categoriesToMap,
  });

  const errorMessage = error
    ? getClientErrorMessage(transformError(error).errorKey)
    : null;

  const retry = useCallback(() => {
    void refetch();
  }, [refetch]);

  return {
    categoriesMap: data ?? {},
    isLoading,
    error: errorMessage,
    retry,
  };
}
