import { useState, useEffect, useCallback } from 'react';
import * as adminUsersService from '../../services/admin/users.service';
import type { UserResponse } from '@shirans/shared';
import { ERROR_KEYS } from '@shirans/shared';
import { getClientErrorMessage } from '../../constants/errorMessages';

export function useAdminUsers() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setError(null);
    setIsLoading(true);
    adminUsersService
      .fetchAllUsers()
      .then(setUsers)
      .catch((err) =>
        setError(err?.message ?? getClientErrorMessage(ERROR_KEYS.SERVER.USER.FETCH_USERS_FAILED))
      )
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setIsLoading(true);
    adminUsersService
      .fetchAllUsers()
      .then((data) => {
        if (!cancelled) setUsers(data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err?.message ?? getClientErrorMessage(ERROR_KEYS.SERVER.USER.FETCH_USERS_FAILED));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    users,
    isLoading,
    error,
    refresh,
  };
}
