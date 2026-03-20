import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminTestimonialsService from '../../services/admin/testimonials.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';
import type { CreateTestimonialInput } from '@shirans/shared';

const ONE_MIN = 60 * 1000;

export function useAdminTestimonials() {
  const queryClient = useQueryClient();

  const {
    data: testimonials = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.testimonials,
    queryFn: adminTestimonialsService.fetchAllTestimonials,
    staleTime: ONE_MIN,
  });

  const errorMessage = error
    ? getClientErrorMessage(transformError(error).errorKey)
    : null;

  const createMutation = useMutation({
    mutationFn: adminTestimonialsService.createTestimonial,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.testimonials,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      input,
    }: { id: string; input: Partial<CreateTestimonialInput> }) =>
      adminTestimonialsService.updateTestimonial(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.testimonials,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminTestimonialsService.deleteTestimonial,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.testimonials,
      });
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, order }: { id: string; order: number }) =>
      adminTestimonialsService.updateTestimonialOrder(id, order),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.testimonials,
      });
    },
  });

  const updateBulkMutation = useMutation({
    mutationFn: ({
      ids,
      isPublished,
    }: { ids: string[]; isPublished: boolean }) =>
      adminTestimonialsService.updateTestimonialsBulk(ids, isPublished),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.testimonials,
      });
    },
  });

  const deleteBulkMutation = useMutation({
    mutationFn: adminTestimonialsService.deleteTestimonialsBulk,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.testimonials,
      });
    },
  });

  return {
    testimonials,
    isLoading,
    error: errorMessage,
    refresh: () => void refetch(),
    create: (input: CreateTestimonialInput) =>
      createMutation.mutateAsync(input),
    update: (id: string, input: Partial<CreateTestimonialInput>) =>
      updateMutation.mutateAsync({ id, input }),
    delete: (id: string) => deleteMutation.mutateAsync(id),
    updateOrder: (id: string, order: number) =>
      updateOrderMutation.mutateAsync({ id, order }),
    updateBulk: (ids: string[], isPublished: boolean) =>
      updateBulkMutation.mutateAsync({ ids, isPublished }),
    deleteBulk: (ids: string[]) => deleteBulkMutation.mutateAsync(ids),
  };
}
