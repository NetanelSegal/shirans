import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as adminUsersService from '../../services/admin/users.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';
import { ERROR_KEYS } from '@shirans/shared';

const ONE_MIN = 60 * 1000;

export function useAdminUsers() {
  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.users,
    queryFn: adminUsersService.fetchAllUsers,
    staleTime: ONE_MIN,
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
