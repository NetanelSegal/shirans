import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DEFAULT_COST_CALCULATOR_CONFIG } from '@shirans/shared';
import type { CostCalculatorConfig, ErrorKey } from '@shirans/shared';
import { calculatorService } from '@/services/calculator.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';
import { QUERY_STALE_TIME_ADMIN_MS } from '@/lib/queryClient';

export function useAdminCalculatorConfig() {
  const queryClient = useQueryClient();
  const [saveError, setSaveError] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.calculatorConfig,
    queryFn: () => calculatorService.getConfig(),
    staleTime: QUERY_STALE_TIME_ADMIN_MS,
  });

  const saveMutation = useMutation({
    mutationFn: (config: CostCalculatorConfig) =>
      calculatorService.updateConfig(config),
    onSuccess: (saved) => {
      setSaveError(null);
      queryClient.setQueryData(queryKeys.calculatorConfig, saved);
    },
    onError: (err: unknown) => {
      setSaveError(getClientErrorMessage(transformError(err).errorKey as ErrorKey));
    },
  });

  return {
    /** Never null: an unsaved installation still has to price the wizard. */
    savedConfig: data ?? DEFAULT_COST_CALCULATOR_CONFIG,
    /**
     * Whether `savedConfig` is the server's answer rather than the placeholder
     * default. The form seeds itself from this and must not seed early — doing
     * so pinned the defaults into the draft before the real rates arrived, and
     * the screen then showed defaults no matter what was stored.
     */
    isSettled: !isLoading,
    isLoading,
    loadError: error
      ? getClientErrorMessage(transformError(error).errorKey as ErrorKey)
      : null,
    save: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    saveError,
    clearSaveError: useCallback(() => setSaveError(null), []),
    savedAt: saveMutation.isSuccess ? saveMutation.submittedAt : null,
  };
}
