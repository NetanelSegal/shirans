import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminProjectsService from '../../services/admin/projects.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';
import type {
  CreateProjectInput,
  UpdateProjectInput,
  UploadImagesInput,
  DeleteMainImageInput,
  DeleteImagesInput,
} from '@shirans/shared';

const ONE_MIN = 60 * 1000;

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
    staleTime: ONE_MIN,
  });

  const errorMessage = error
    ? getClientErrorMessage(transformError(error).errorKey)
    : null;

  const createMutation = useMutation({
    mutationFn: adminProjectsService.createProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.projects });
    },
  });

  const updateMutation = useMutation({
    mutationFn: adminProjectsService.updateProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.projects });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminProjectsService.deleteProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.projects });
    },
  });

  const uploadImagesMutation = useMutation({
    mutationFn: adminProjectsService.uploadProjectImages,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.projects });
    },
  });

  const deleteMainImageMutation = useMutation({
    mutationFn: adminProjectsService.deleteMainImage,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.projects });
    },
  });

  const deleteProjectImagesMutation = useMutation({
    mutationFn: adminProjectsService.deleteProjectImages,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.projects });
    },
  });

  return {
    projects,
    isLoading,
    error: errorMessage,
    refresh: () => void refetch(),
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
