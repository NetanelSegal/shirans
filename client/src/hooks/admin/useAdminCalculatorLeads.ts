import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calculatorService } from '@/services/calculator.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';
import { QUERY_STALE_TIME_ADMIN_MS } from '@/lib/queryClient';
import type { ErrorKey } from '@shirans/shared';

export function useAdminCalculatorLeads() {
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);

  const {
    data: leads = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.calculatorLeads,
    queryFn: () => calculatorService.getLeads(),
    staleTime: QUERY_STALE_TIME_ADMIN_MS,
  });

  const errorMessage = error
    ? getClientErrorMessage(transformError(error).errorKey as ErrorKey)
    : null;

  const handleActionError = useCallback((err: unknown) => {
    const appError = transformError(err);
    setActionError(getClientErrorMessage(appError.errorKey as ErrorKey));
  }, []);

  const refresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const updateReadStatusMutation = useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) =>
      calculatorService.updateLeadRead(id, isRead),
    onSuccess: () => {
      setActionError(null);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.calculatorLeads,
      });
    },
    onError: handleActionError,
  });

  const deleteMutation = useMutation({
    mutationFn: calculatorService.deleteLead,
    onSuccess: () => {
      setActionError(null);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.calculatorLeads,
      });
    },
    onError: handleActionError,
  });

  const updateReadStatusBulkMutation = useMutation({
    mutationFn: ({ ids, isRead }: { ids: string[]; isRead: boolean }) =>
      calculatorService.updateLeadReadBulk(ids, isRead),
    onSuccess: () => {
      setActionError(null);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.calculatorLeads,
      });
    },
    onError: handleActionError,
  });

  const deleteBulkMutation = useMutation({
    mutationFn: calculatorService.deleteLeadsBulk,
    onSuccess: () => {
      setActionError(null);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.calculatorLeads,
      });
    },
    onError: handleActionError,
  });

  return {
    leads,
    isLoading,
    error: errorMessage,
    actionError,
    clearActionError: useCallback(() => setActionError(null), []),
    refresh,
    updateReadStatus: (id: string, isRead: boolean) =>
      updateReadStatusMutation.mutateAsync({ id, isRead }),
    delete: (id: string) => deleteMutation.mutateAsync(id),
    updateReadStatusBulk: (ids: string[], isRead: boolean) =>
      updateReadStatusBulkMutation.mutateAsync({ ids, isRead }),
    deleteBulk: (ids: string[]) => deleteBulkMutation.mutateAsync(ids),
  };
}
