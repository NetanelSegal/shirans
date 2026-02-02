import axios, { InternalAxiosRequestConfig } from 'axios';
import { MAIN_URL } from '../constants/urls';
import { HTTP_STATUS } from '../constants/httpStatus';
import { getAccessToken, removeAccessToken } from './tokenStorage';
import { transformError } from './errorHandler';
import { refreshAccessToken } from '../services/tokenRefresh.service';

const apiClient = axios.create({
  baseURL: MAIN_URL,
  timeout: 10000,
  withCredentials: true, // For httpOnly cookies (refresh tokens)
});

// Request interceptor: Add Authorization header
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle errors and transform
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const appError = transformError(error);

    // Handle 401 - Try to refresh token
    if (appError.statusCode === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          // Retry original request with new token
          const token = getAccessToken();
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        }
      } catch {
        // Refresh failed, clear tokens and redirect to login
        removeAccessToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(appError);
  }
);

export default apiClient;
