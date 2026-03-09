import { useState, useEffect, useCallback } from 'react';
import { calculatorService } from '@/services/calculator.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import type { CalculatorLeadResponse, ErrorKey } from '@shirans/shared';

export function useAdminCalculatorLeads() {
  const [leads, setLeads] = useState<CalculatorLeadResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchLeads = useCallback((isCancelled?: () => boolean) => {
    setError(null);
    setIsLoading(true);
    return calculatorService
      .getLeads()
      .then((data) => {
        if (!isCancelled?.()) setLeads(data);
        return data;
      })
      .catch((err) => {
        if (!isCancelled?.()) {
          const appError = transformError(err);
          setError(getClientErrorMessage(appError.errorKey as ErrorKey));
        }
        throw err;
      })
      .finally(() => {
        if (!isCancelled?.()) setIsLoading(false);
      });
  }, []);

  const refresh = useCallback(() => fetchLeads(), [fetchLeads]);

  useEffect(() => {
    let cancelled = false;
    fetchLeads(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [fetchLeads]);

  const setActionErr = useCallback((err: unknown) => {
    const appError = transformError(err);
    setActionError(getClientErrorMessage(appError.errorKey as ErrorKey));
  }, []);

  const updateReadStatus = useCallback(
    async (id: string, isRead: boolean) => {
      try {
        const updated = await calculatorService.updateLeadRead(id, isRead);
        setLeads((prev) =>
          prev.map((l) => (l.id === updated.id ? updated : l))
        );
        setActionError(null);
        return updated;
      } catch (err) {
        setActionErr(err);
        throw err;
      }
    },
    [setActionErr]
  );

  const remove = useCallback(async (id: string) => {
    try {
      await calculatorService.deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setActionError(null);
    } catch (err) {
      setActionErr(err);
      throw err;
    }
  }, [setActionErr]);

  const updateReadStatusBulk = useCallback(
    async (ids: string[], isRead: boolean) => {
      try {
        await calculatorService.updateLeadReadBulk(ids, isRead);
        setLeads((prev) =>
          prev.map((l) => (ids.includes(l.id) ? { ...l, isRead } : l))
        );
        setActionError(null);
      } catch (err) {
        setActionErr(err);
        throw err;
      }
    },
    [setActionErr]
  );

  const deleteBulk = useCallback(async (ids: string[]) => {
    try {
      await calculatorService.deleteLeadsBulk(ids);
      setLeads((prev) => prev.filter((l) => !ids.includes(l.id)));
      setActionError(null);
    } catch (err) {
      setActionErr(err);
      throw err;
    }
  }, [setActionErr]);

  return {
    leads,
    isLoading,
    error,
    actionError,
    clearActionError: useCallback(() => setActionError(null), []),
    refresh,
    updateReadStatus,
    delete: remove,
    updateReadStatusBulk,
    deleteBulk,
  };
}
