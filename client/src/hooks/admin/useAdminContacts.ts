import { useState, useEffect, useCallback } from 'react';
import * as adminContactsService from '../../services/admin/contacts.service';
import type { ContactResponse } from '@shirans/shared';

export function useAdminContacts() {
  const [contacts, setContacts] = useState<ContactResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setError(null);
    setIsLoading(true);
    adminContactsService
      .fetchAllContacts()
      .then(setContacts)
      .catch((err) => setError(err?.message ?? 'שגיאה בטעינת הפניות'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setIsLoading(true);
    adminContactsService
      .fetchAllContacts()
      .then((data) => {
        if (!cancelled) setContacts(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? 'שגיאה בטעינת הפניות');
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
      const updated = await adminContactsService.updateContactReadStatus(
        id,
        isRead
      );
      setContacts((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      return updated;
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    await adminContactsService.deleteContact(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateReadStatusBulk = useCallback(
    async (ids: string[], isRead: boolean) => {
      await adminContactsService.updateContactReadStatusBulk(ids, isRead);
      setContacts((prev) =>
        prev.map((c) => (ids.includes(c.id) ? { ...c, isRead } : c))
      );
    },
    []
  );

  const deleteBulk = useCallback(async (ids: string[]) => {
    await adminContactsService.deleteContactsBulk(ids);
    setContacts((prev) => prev.filter((c) => !ids.includes(c.id)));
  }, []);

  return {
    contacts,
    isLoading,
    error,
    refresh,
    updateReadStatus,
    delete: remove,
    updateReadStatusBulk,
    deleteBulk,
  };
}
