import { createContext, useContext, useCallback, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '@/services/projects.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';
import {
  QUERY_GC_TIME_MS,
  QUERY_STALE_TIME_MS,
} from '@/lib/queryClient';
import type { ProjectResponse } from '@shirans/shared';

interface ProjectsContextType {
  projects: ProjectResponse[];
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined,
);

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.projects,
    queryFn: fetchProjects,
    staleTime: QUERY_STALE_TIME_MS,
    gcTime: QUERY_GC_TIME_MS,
  });

  const errorMessage = error
    ? getClientErrorMessage(transformError(error).errorKey)
    : null;

  const retry = useCallback(() => {
    void refetch();
  }, [refetch]);

  return (
    <ProjectsContext.Provider
      value={{
        projects: data ?? [],
        isLoading,
        error: errorMessage,
        retry,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = (): ProjectsContextType => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
