import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '@/services/projects.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';
import type { ProjectResponse } from '@shirans/shared';

export function useProjects() {
  const { data, isLoading, error, refetch } = useQuery<ProjectResponse[]>({
    queryKey: queryKeys.projects,
    queryFn: fetchProjects,
  });

  const errorMessage = error
    ? getClientErrorMessage(transformError(error).errorKey)
    : null;

  const retry = useCallback(() => {
    void refetch();
  }, [refetch]);

  return {
    projects: data ?? [],
    isLoading,
    error: errorMessage,
    retry,
  };
}
