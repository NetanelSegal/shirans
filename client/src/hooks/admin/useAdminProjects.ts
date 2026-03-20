import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminProjectsService from '../../services/admin/projects.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';
import { QUERY_STALE_TIME_ADMIN_MS } from '@/lib/queryClient';
import { invalidateAfterAdminProjectsChange } from '@/lib/queryInvalidation';
import type {
  CreateProjectInput,
  UpdateProjectInput,
  UploadImagesInput,
  DeleteMainImageInput,
  DeleteImagesInput,
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

  return {
    projects,
    isLoading,
    error: errorMessage,
    refresh,
    create: (input: CreateProjectInput) => createMutation.mutateAsync(input),
    update: (input: UpdateProjectInput) => updateMutation.mutateAsync(input),
    delete: (id: string) => deleteMutation.mutateAsync(id),
    uploadImages: (input: UploadImagesInput) =>
      uploadImagesMutation.mutateAsync(input),
    deleteMainImage: (input: DeleteMainImageInput) =>
      deleteMainImageMutation.mutateAsync(input),
    deleteProjectImages: (input: DeleteImagesInput) =>
      deleteProjectImagesMutation.mutateAsync(input),
  };
}
