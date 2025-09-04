import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { AuthService } from '../../api/authService';
import { getAuthToken } from '../../api/client';
import { AuthResponse, User, UserLogin, UserRegister } from '../../types/buisness';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: UserLogin) => Promise<AuthResponse>;
  register: (credentials: UserRegister) => Promise<{ message: string; user: User }>;
  logout: () => void;
  getCurrentUser: () => Promise<User>;
  hasPermission: (permission: string) => boolean;
  isUserRole: (role: string) => boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(getAuthToken() && user);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const token = getAuthToken();

      if (token) {
        try {
          const currentUser = await AuthService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Failed to get current user:', error);
          AuthService.logout();
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: UserLogin): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const authResponse = await AuthService.login(credentials);
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      return authResponse;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (credentials: UserRegister) => {
    setIsLoading(true);
    try {
      const result = await AuthService.register(credentials);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
  }, []);

  const getCurrentUser = useCallback(async (): Promise<User> => {
    const currentUser = await AuthService.getCurrentUser();
    setUser(currentUser);
    return currentUser;
  }, []);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      return isAuthenticated;
    },
    [user, isAuthenticated],
  );

  const isUserRole = useCallback(
    (role: string): boolean => {
      if (!user) return false;
      return isAuthenticated;
    },
    [user, isAuthenticated],
  );

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    getCurrentUser,
    hasPermission,
    isUserRole,
    isAdmin: user?.isAdmin || false,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
