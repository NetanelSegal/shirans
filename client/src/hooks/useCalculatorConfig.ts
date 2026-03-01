import { useState, useEffect } from 'react';
import type { CalculatorConfigInput } from '@shirans/shared';
import { calculatorService } from '@/services/calculator.service';

export function useCalculatorConfig() {
  const [config, setConfig] = useState<CalculatorConfigInput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    calculatorService
      .getConfig()
      .then((c) => setConfig(c))
      .catch(() => setConfig(null))
      .finally(() => setIsLoading(false));
  }, []);

  return { config, isLoading };
}
