import type { QueryClient } from '@tanstack/react-query';
import type { ProjectMediaItem, ProjectResponse } from '@shirans/shared';
import { queryKeys } from '@/constants/queryKeys';

export function patchAdminProjectInCache(
  queryClient: QueryClient,
  updated: ProjectResponse,
): void {
  queryClient.setQueryData<ProjectResponse[]>(
    queryKeys.admin.projects,
    (old) => {
      if (!old) return old;
      return old.map((project) =>
        project.id === updated.id ? updated : project,
      );
    },
  );
}

export function patchAdminProjectMediaInCache(
  queryClient: QueryClient,
  projectId: string,
  media: ProjectMediaItem[],
): void {
  queryClient.setQueryData<ProjectResponse[]>(
    queryKeys.admin.projects,
    (old) => {
      if (!old) return old;
      return old.map((project) =>
        project.id === projectId ? { ...project, media } : project,
      );
    },
  );
}

export function addAdminProjectToCache(
  queryClient: QueryClient,
  project: ProjectResponse,
): void {
  queryClient.setQueryData<ProjectResponse[]>(
    queryKeys.admin.projects,
    (old) => (old ? [project, ...old] : [project]),
  );
}

export function removeAdminProjectFromCache(
  queryClient: QueryClient,
  projectId: string,
): void {
  queryClient.setQueryData<ProjectResponse[]>(
    queryKeys.admin.projects,
    (old) => old?.filter((project) => project.id !== projectId),
  );
}

/** Refresh public project caches without refetching the full admin list. */
export function invalidatePublicProjectsCache(
  queryClient: QueryClient,
  projectId?: string,
): void {
  void queryClient.invalidateQueries({ queryKey: queryKeys.projects });
  if (projectId) {
    void queryClient.invalidateQueries({
      queryKey: queryKeys.project(projectId),
    });
  }
}
