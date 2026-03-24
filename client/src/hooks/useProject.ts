import { useQuery } from '@tanstack/react-query';
import { fetchProject } from '@/services/projects.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';
import { useProjects } from '@/hooks/useProjects';

/**
 * Resolves a project from the list cache when possible, otherwise fetches by id.
 */
export function useProject(projectId: string | undefined) {
  const { projects, isLoading: projectsLoading } = useProjects();

  const projectFromList = projectId
    ? projects.find((p) => p.id === projectId)
    : undefined;

  const detailFetchEnabled =
    Boolean(projectId) && !projectFromList && !projectsLoading;

  const {
    data: directProject,
    isLoading: directLoading,
    error: directError,
  } = useQuery({
    queryKey: projectId
      ? queryKeys.project(projectId)
      : queryKeys.projectDetailDisabled,
    queryFn: () => fetchProject(projectId!),
    enabled: detailFetchEnabled,
  });

  const project = projectFromList ?? directProject ?? null;
  const directErrorMessage = directError
    ? getClientErrorMessage(transformError(directError).errorKey)
    : null;

  return {
    project,
    projectFromList,
    projectsLoading,
    directLoading,
    directErrorMessage,
  };
}
