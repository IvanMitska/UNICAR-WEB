import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  language?: string;
  currency?: string;
  notifyEmail?: boolean;
  notifyPush?: boolean;
  notifySms?: boolean;
  notifyMarketing?: boolean;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    const { data, error } = await api.auth.me();
    if (data?.user) {
      setUser(data.user);
    } else if (error) {
      localStorage.removeItem('auth_token');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    const { data, error } = await api.auth.login({ email, password });

    if (data) {
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      return { success: true };
    }

    return { success: false, error };
  };

  const register = async (registerData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  }) => {
    const { data, error } = await api.auth.register(registerData);

    if (data) {
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      return { success: true };
    }

    return { success: false, error };
  };

  const logout = async () => {
    await api.auth.logout();
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    const { data, error } = await api.auth.forgotPassword(email);
    if (data) {
      return { success: true };
    }
    return { success: false, error };
  };

  const resetPassword = async (token: string, password: string) => {
    const { data, error } = await api.auth.resetPassword(token, password);
    if (data) {
      return { success: true };
    }
    return { success: false, error };
  };

  const refreshUser = async () => {
    const { data } = await api.auth.me();
    if (data?.user) {
      setUser(data.user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
