import { useQuery } from '@tanstack/react-query';
import type { ErrorKey } from '@shirans/shared';
import { calculatorService } from '@/services/calculator.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';

export function useCalculatorConfig() {
  const { data: config, isLoading, error } = useQuery({
    queryKey: queryKeys.calculatorConfig,
    queryFn: () => calculatorService.getConfig(),
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
