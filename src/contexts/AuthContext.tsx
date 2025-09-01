import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthService } from '../api/authService';
import { getAuthToken } from '../api/client';
import { User, UserLogin, UserRegister, AuthResponse } from '../types/buisness';

export interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (credentials: UserLogin) => Promise<AuthResponse>;
  register: (credentials: UserRegister) => Promise<{ message: string; user: User }>;
  logout: () => void;
  getCurrentUser: () => Promise<User>;
  
  // Utility
  hasPermission: (permission: string) => boolean;
  isUserRole: (role: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is authenticated based on token and user data
  const isAuthenticated = Boolean(getAuthToken() && user);

  // Initialize auth state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const token = getAuthToken();
      
      if (token) {
        try {
          // If we have a token, try to get current user info
          const currentUser = await AuthService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Failed to get current user:', error);
          // If token is invalid, clear it
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
      
      // After successful login, get user info
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
      // Note: Registration doesn't automatically log in, so we don't set user state
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

  // Permission and role checking utilities
  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    
    // Add your permission logic here based on your backend implementation
    // For now, authenticated users have all permissions
    return isAuthenticated;
  }, [user, isAuthenticated]);

  const isUserRole = useCallback((role: string): boolean => {
    if (!user) return false;
    
    // Add your role logic here based on your backend implementation
    // This would typically check user.role or user.roles array
    // For now, we'll return true for authenticated users
    return isAuthenticated;
  }, [user, isAuthenticated]);

  const contextValue: AuthContextType = {
    // State
    user,
    isAuthenticated,
    isLoading,
    
    // Actions
    login,
    register,
    logout,
    getCurrentUser,
    
    // Utility
    hasPermission,
    isUserRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
