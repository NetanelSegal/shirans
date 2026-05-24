import type { QueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminProjectsService from '../../services/admin/projects.service';
import type { UploadProjectImagesInput } from '../../services/admin/projects.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';
import { QUERY_STALE_TIME_ADMIN_MS } from '@/lib/queryClient';
import {
  addAdminProjectToCache,
  patchAdminProjectInCache,
  patchAdminProjectMediaInCache,
  removeAdminProjectFromCache,
  invalidatePublicProjectsCache,
} from '@/lib/adminProjectsCache';
import type {
  CreateProjectInput,
  UpdateProjectInput,
  DeleteMainImageInput,
  DeleteImagesInput,
  ReorderImagesInput,
  ProjectResponse,
} from '@shirans/shared';

function getAdminProjectsSnapshot(
  queryClient: QueryClient,
): ProjectResponse[] | undefined {
  return queryClient.getQueryData<ProjectResponse[]>(queryKeys.admin.projects);
}

export function useAdminProjects() {
  const queryClient = useQueryClient();

  const {
    data: projects = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.projects,
    queryFn: adminProjectsService.fetchAllProjects,
    staleTime: QUERY_STALE_TIME_ADMIN_MS,
  });

  const errorMessage = error
    ? getClientErrorMessage(transformError(error).errorKey)
    : null;

  const refresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const createMutation = useMutation({
    mutationFn: adminProjectsService.createProject,
    onSuccess: (created) => {
      addAdminProjectToCache(queryClient, created);
      invalidatePublicProjectsCache(queryClient);
    },
  });

  const updateMutation = useMutation({
    mutationFn: adminProjectsService.updateProject,
    onSuccess: (updated) => {
      patchAdminProjectInCache(queryClient, updated);
      invalidatePublicProjectsCache(queryClient, updated.id);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminProjectsService.deleteProject,
    onSuccess: (_data, id) => {
      removeAdminProjectFromCache(queryClient, id);
      invalidatePublicProjectsCache(queryClient, id);
    },
  });

  const uploadImagesMutation = useMutation({
    mutationFn: adminProjectsService.uploadProjectImages,
    onSuccess: (updated) => {
      patchAdminProjectInCache(queryClient, updated);
      invalidatePublicProjectsCache(queryClient, updated.id);
    },
  });

  const deleteMainImageMutation = useMutation({
    mutationFn: adminProjectsService.deleteMainImage,
    onSuccess: (_data, input) => {
      const project = getAdminProjectsSnapshot(queryClient)?.find(
        (entry) => entry.id === input.id,
      );
      if (project) {
        patchAdminProjectMediaInCache(
          queryClient,
          input.id,
          project.media.filter((item) => item.type !== 'MAIN'),
        );
      }
      invalidatePublicProjectsCache(queryClient, input.id);
    },
  });

  const deleteProjectImagesMutation = useMutation({
    mutationFn: adminProjectsService.deleteProjectImages,
    onSuccess: (_data, input) => {
      const remove = new Set(input.imageIds);
      const project = getAdminProjectsSnapshot(queryClient)?.find(
        (entry) => entry.id === input.id,
      );
      if (project) {
        patchAdminProjectMediaInCache(
          queryClient,
          input.id,
          project.media.filter((item) => !remove.has(item.id)),
        );
      }
      invalidatePublicProjectsCache(queryClient, input.id);
    },
  });

  const reorderImagesMutation = useMutation({
    mutationFn: adminProjectsService.reorderImages,
    onSuccess: (updated) => {
      patchAdminProjectInCache(queryClient, updated);
      invalidatePublicProjectsCache(queryClient, updated.id);
    },
  });

  const isMutationPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    uploadImagesMutation.isPending ||
    deleteMainImageMutation.isPending ||
    deleteProjectImagesMutation.isPending ||
    reorderImagesMutation.isPending;

  return {
    projects,
    isLoading,
    error: errorMessage,
    refresh,
    isMutationPending,
    create: (input: CreateProjectInput) => createMutation.mutateAsync(input),
    update: (input: UpdateProjectInput) => updateMutation.mutateAsync(input),
    delete: (id: string) => deleteMutation.mutateAsync(id),
    uploadImages: (input: UploadProjectImagesInput) =>
      uploadImagesMutation.mutateAsync(input),
    deleteMainImage: (input: DeleteMainImageInput) =>
      deleteMainImageMutation.mutateAsync(input),
    deleteProjectImages: (input: DeleteImagesInput) =>
      deleteProjectImagesMutation.mutateAsync(input),
    reorderImages: (input: ReorderImagesInput) =>
      reorderImagesMutation.mutateAsync(input),
  };
}
