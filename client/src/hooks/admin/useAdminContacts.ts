import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminContactsService from '../../services/admin/contacts.service';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { queryKeys } from '@/constants/queryKeys';
import type { ContactResponse } from '@shirans/shared';

const ONE_MIN = 60 * 1000;

export function useAdminContacts() {
  const queryClient = useQueryClient();

  const {
    data: contacts = [],
    isLoading,
    error,
    refetch,
  } = useQuery<ContactResponse[]>({
    queryKey: queryKeys.admin.contacts,
    queryFn: () => adminContactsService.fetchAllContacts(),
    staleTime: ONE_MIN,
  });

  const errorMessage = error
    ? getClientErrorMessage(transformError(error).errorKey)
    : null;

  const updateReadStatusMutation = useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) =>
      adminContactsService.updateContactReadStatus(id, isRead),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.contacts,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminContactsService.deleteContact,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.contacts,
      });
    },
  });

  const updateReadStatusBulkMutation = useMutation({
    mutationFn: ({ ids, isRead }: { ids: string[]; isRead: boolean }) =>
      adminContactsService.updateContactReadStatusBulk(ids, isRead),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.contacts,
      });
    },
  });

  const deleteBulkMutation = useMutation({
    mutationFn: adminContactsService.deleteContactsBulk,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.admin.contacts,
      });
    },
  });

  return {
    contacts,
    isLoading,
    error: errorMessage,
    refresh: () => void refetch(),
    updateReadStatus: (id: string, isRead: boolean) =>
      updateReadStatusMutation.mutateAsync({ id, isRead }),
    delete: (id: string) => deleteMutation.mutateAsync(id),
    updateReadStatusBulk: (ids: string[], isRead: boolean) =>
      updateReadStatusBulkMutation.mutateAsync({ ids, isRead }),
    deleteBulk: (ids: string[]) => deleteBulkMutation.mutateAsync(ids),
  };
}
