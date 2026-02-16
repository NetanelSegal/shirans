import axios from 'axios';
import { urls } from '../constants/urls';
import { setAccessToken, removeAccessToken } from '../utils/tokenStorage';

// Use a plain axios instance (no interceptors) to avoid deadlock:
// apiClient's interceptor tries to refresh on 401, and if the refresh call
// itself goes through apiClient, a 401 on refresh triggers another refresh → infinite loop.
const refreshClient = axios.create({
  withCredentials: true, // Needed to send httpOnly refresh token cookie
});

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
      const response = await refreshClient.post(urls.auth.refresh);
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
