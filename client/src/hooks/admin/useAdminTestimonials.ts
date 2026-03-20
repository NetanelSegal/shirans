import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminTestimonialsService from '../../services/admin/testimonials.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';
import { invalidateAfterAdminTestimonialsChange } from '@/lib/queryInvalidation';
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

  const refresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const createMutation = useMutation({
    mutationFn: adminTestimonialsService.createTestimonial,
    onSuccess: () => invalidateAfterAdminTestimonialsChange(queryClient),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      input,
    }: { id: string; input: Partial<CreateTestimonialInput> }) =>
      adminTestimonialsService.updateTestimonial(id, input),
    onSuccess: () => invalidateAfterAdminTestimonialsChange(queryClient),
  });

  const deleteMutation = useMutation({
    mutationFn: adminTestimonialsService.deleteTestimonial,
    onSuccess: () => invalidateAfterAdminTestimonialsChange(queryClient),
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, order }: { id: string; order: number }) =>
      adminTestimonialsService.updateTestimonialOrder(id, order),
    onSuccess: () => invalidateAfterAdminTestimonialsChange(queryClient),
  });

  const updateBulkMutation = useMutation({
    mutationFn: ({
      ids,
      isPublished,
    }: { ids: string[]; isPublished: boolean }) =>
      adminTestimonialsService.updateTestimonialsBulk(ids, isPublished),
    onSuccess: () => invalidateAfterAdminTestimonialsChange(queryClient),
  });

  const deleteBulkMutation = useMutation({
    mutationFn: adminTestimonialsService.deleteTestimonialsBulk,
    onSuccess: () => invalidateAfterAdminTestimonialsChange(queryClient),
  });

  return {
    testimonials,
    isLoading,
    error: errorMessage,
    refresh,
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
