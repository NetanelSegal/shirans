import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminProjectsService from '../../services/admin/projects.service';
import type { UploadProjectImagesInput } from '../../services/admin/projects.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';
import { QUERY_STALE_TIME_ADMIN_MS } from '@/lib/queryClient';
import { invalidateAfterAdminProjectsChange } from '@/lib/queryInvalidation';
import type {
  CreateProjectInput,
  UpdateProjectInput,
  DeleteMainImageInput,
  DeleteImagesInput,
  ReorderImagesInput,
} from '@shirans/shared';

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
    onSuccess: () => invalidateAfterAdminProjectsChange(queryClient),
  });

  const updateMutation = useMutation({
    mutationFn: adminProjectsService.updateProject,
    onSuccess: () => invalidateAfterAdminProjectsChange(queryClient),
  });

  const deleteMutation = useMutation({
    mutationFn: adminProjectsService.deleteProject,
    onSuccess: () => invalidateAfterAdminProjectsChange(queryClient),
  });

  const uploadImagesMutation = useMutation({
    mutationFn: adminProjectsService.uploadProjectImages,
    onSuccess: () => invalidateAfterAdminProjectsChange(queryClient),
  });

  const deleteMainImageMutation = useMutation({
    mutationFn: adminProjectsService.deleteMainImage,
    onSuccess: () => invalidateAfterAdminProjectsChange(queryClient),
  });

  const deleteProjectImagesMutation = useMutation({
    mutationFn: adminProjectsService.deleteProjectImages,
    onSuccess: () => invalidateAfterAdminProjectsChange(queryClient),
  });

  const reorderImagesMutation = useMutation({
    mutationFn: adminProjectsService.reorderImages,
    onSuccess: () => invalidateAfterAdminProjectsChange(queryClient),
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
