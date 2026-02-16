import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import apiClient from '../utils/apiClient';
import { setAccessToken, getAccessToken, removeAccessToken } from '../utils/tokenStorage';
import { urls } from '../constants/urls';
import { refreshAccessToken } from '../services/tokenRefresh.service';
import type { UserResponse } from '@shirans/shared';

interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<void> => {
    const token = getAccessToken();

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.get(urls.auth.me);

      setUser(response.data.user);
    } catch {
      removeAccessToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    const response = await apiClient.post(urls.auth.login, { email, password });
    const { accessToken, user: userData } = response.data;

    setAccessToken(accessToken);
    setUser(userData);
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    const response = await apiClient.post(urls.auth.register, { email, password, name });
    const { accessToken, user: userData } = response.data;

    setAccessToken(accessToken);
    setUser(userData);
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.post(urls.auth.logout);
    } catch {
      // Ignore errors on logout
    } finally {
      removeAccessToken();
      setUser(null);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Re-check auth to get updated user if needed
        await checkAuth();
        return true;
      }
      return false;
    } catch {
      removeAccessToken();
      setUser(null);
      return false;
    }
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      refreshToken,
    }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
