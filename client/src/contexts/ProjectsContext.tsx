import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '@/services/projects.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';
import type { ProjectResponse } from '@shirans/shared';

const FIVE_MIN = 5 * 60 * 1000;
const TEN_MIN = 10 * 60 * 1000;

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
    staleTime: FIVE_MIN,
    gcTime: TEN_MIN,
  });

  const errorMessage = error
    ? getClientErrorMessage(transformError(error).errorKey)
    : null;

  return (
    <ProjectsContext.Provider
      value={{
        projects: data ?? [],
        isLoading,
        error: errorMessage,
        retry: () => void refetch(),
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
