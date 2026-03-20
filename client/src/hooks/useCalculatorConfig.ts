import { useQuery } from '@tanstack/react-query';
import type { ErrorKey } from '@shirans/shared';
import { calculatorService } from '@/services/calculator.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';
import { QUERY_GC_TIME_MS, QUERY_STALE_TIME_MS } from '@/lib/queryClient';

export function useCalculatorConfig() {
  const { data: config, isLoading, error } = useQuery({
    queryKey: queryKeys.calculatorConfig,
    queryFn: () => calculatorService.getConfig(),
    staleTime: QUERY_STALE_TIME_MS,
    gcTime: QUERY_GC_TIME_MS,
  });

  const errorMessage = error
    ? getClientErrorMessage(transformError(error).errorKey as ErrorKey)
    : null;

  return {
    config: config ?? null,
    isLoading,
    error: errorMessage,
  };
}
