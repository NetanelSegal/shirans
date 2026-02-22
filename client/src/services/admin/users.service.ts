import apiClient from '../../utils/apiClient';
import { urls } from '../../constants/urls';
import type { UserResponse } from '@shirans/shared';

export async function fetchAllUsers(): Promise<UserResponse[]> {
  const { data } = await apiClient.get<UserResponse[]>(urls.adminUsers.getAll);
  return data;
}
