import apiClient from '../../utils/apiClient';
import { urls } from '../../constants/urls';
import type { ContactResponse } from '@shirans/shared';

export async function fetchAllContacts(
  filters?: { isRead?: boolean }
): Promise<ContactResponse[]> {
  const params =
    filters?.isRead !== undefined
      ? { isRead: String(filters.isRead) }
      : undefined;
  const { data } = await apiClient.get<ContactResponse[]>(
    urls.adminContacts.getAll,
    { params }
  );
  return data;
}

export async function fetchContactById(id: string): Promise<ContactResponse> {
  const { data } = await apiClient.get<ContactResponse>(
    urls.adminContacts.getById(id)
  );
  return data;
}

export async function updateContactReadStatus(
  id: string,
  isRead: boolean
): Promise<ContactResponse> {
  const { data } = await apiClient.patch<ContactResponse>(
    urls.adminContacts.updateRead(id),
    { isRead }
  );
  return data;
}

export async function deleteContact(id: string): Promise<void> {
  await apiClient.delete(urls.adminContacts.delete(id));
}
