import { useState, useEffect } from 'react';
import type { CalculatorConfigInput, ErrorKey } from '@shirans/shared';
import { calculatorService } from '@/services/calculator.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';

export function useCalculatorConfig() {
  const [config, setConfig] = useState<CalculatorConfigInput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    calculatorService
      .getConfig()
      .then((c) => setConfig(c))
      .catch((err) => {
        const appError = transformError(err);
        setConfig(null);
        setError(getClientErrorMessage(appError.errorKey as ErrorKey));
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { config, isLoading, error };
}
