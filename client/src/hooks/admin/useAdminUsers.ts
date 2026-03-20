import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as adminUsersService from '../../services/admin/users.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';
import { QUERY_STALE_TIME_ADMIN_MS } from '@/lib/queryClient';
import { ERROR_KEYS } from '@shirans/shared';

export function useAdminUsers() {
  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.users,
    queryFn: adminUsersService.fetchAllUsers,
    staleTime: QUERY_STALE_TIME_ADMIN_MS,
  });

  const errorMessage = error
    ? getClientErrorMessage(
        transformError(error).errorKey ?? ERROR_KEYS.SERVER.USER.FETCH_USERS_FAILED,
      )
    : null;

  const refresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  return {
    users,
    isLoading,
    error: errorMessage,
    refresh,
  };
}
