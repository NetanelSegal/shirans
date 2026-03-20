import { useQuery } from '@tanstack/react-query';
import type { ErrorKey } from '@shirans/shared';
import { calculatorService } from '@/services/calculator.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';

const FIVE_MIN = 5 * 60 * 1000;
const TEN_MIN = 10 * 60 * 1000;

export function useCalculatorConfig() {
  const { data: config, isLoading, error } = useQuery({
    queryKey: queryKeys.calculatorConfig,
    queryFn: () => calculatorService.getConfig(),
    staleTime: FIVE_MIN,
    gcTime: TEN_MIN,
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
