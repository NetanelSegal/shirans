import { useState, useEffect, useCallback } from 'react';
import { calculatorService } from '@/services/calculator.service';
import type { CalculatorLeadResponse } from '@shirans/shared';

export function useAdminCalculatorLeads() {
  const [leads, setLeads] = useState<CalculatorLeadResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setError(null);
    setIsLoading(true);
    calculatorService
      .getLeads()
      .then(setLeads)
      .catch((err) => setError(err?.message ?? 'שגיאה בטעינת הלידים'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setIsLoading(true);
    calculatorService
      .getLeads()
      .then((data) => {
        if (!cancelled) setLeads(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? 'שגיאה בטעינת הלידים');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateReadStatus = useCallback(
    async (id: string, isRead: boolean) => {
      const updated = await calculatorService.updateLeadRead(id, isRead);
      setLeads((prev) =>
        prev.map((l) => (l.id === updated.id ? updated : l))
      );
      return updated;
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    await calculatorService.deleteLead(id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return {
    leads,
    isLoading,
    error,
    refresh,
    updateReadStatus,
    delete: remove,
  };
}
