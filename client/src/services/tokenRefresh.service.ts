import apiClient from '../utils/apiClient';
import { urls } from '../constants/urls';
import { setAccessToken, removeAccessToken } from '../utils/tokenStorage';

let refreshPromise: Promise<boolean> | null = null;

/**
 * Refresh access token using refresh token from httpOnly cookie
 * @returns True if refresh successful, false otherwise
 */
export async function refreshAccessToken(): Promise<boolean> {
  // Prevent multiple simultaneous refresh calls
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await apiClient.post(urls.auth.refresh);
      const { accessToken } = response.data;
      setAccessToken(accessToken);
      return true;
    } catch {
      removeAccessToken();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
