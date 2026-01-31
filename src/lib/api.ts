const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

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

export interface AuthResponse {
  user: User;
  token: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('auth_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${AUTH_API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Something went wrong' };
    }

    return { data };
  } catch (error) {
    return { error: 'Network error. Please try again.' };
  }
}

export const api = {
  auth: {
    register: (data: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      password: string;
    }) =>
      request<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    login: (data: { email: string; password: string }) =>
      request<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    forgotPassword: (email: string) =>
      request<{ message: string }>('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),

    resetPassword: (token: string, password: string) =>
      request<{ message: string }>('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      }),

    me: () => request<{ user: User }>('/api/auth/me'),

    logout: () =>
      request<{ message: string }>('/api/auth/logout', {
        method: 'POST',
      }),
  },

  user: {
    updateProfile: (data: { firstName?: string; lastName?: string; phone?: string }) =>
      request<{ user: User }>('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    updateSettings: (data: { language?: string; currency?: string }) =>
      request<{ language: string; currency: string }>('/api/user/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    updateNotifications: (data: {
      notifyEmail?: boolean;
      notifyPush?: boolean;
      notifySms?: boolean;
      notifyMarketing?: boolean;
    }) =>
      request<{
        notifyEmail: boolean;
        notifyPush: boolean;
        notifySms: boolean;
        notifyMarketing: boolean;
      }>('/api/user/notifications', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      request<{ message: string }>('/api/user/password', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    getFavorites: () =>
      request<{ favorites: string[] }>('/api/user/favorites'),

    addFavorite: (carId: string) =>
      request<{ message: string; favorited: boolean; count: number }>('/api/user/favorites', {
        method: 'POST',
        body: JSON.stringify({ carId }),
      }),

    removeFavorite: (carId: string) =>
      request<{ message: string; favorited: boolean; count: number }>(`/api/user/favorites/${carId}`, {
        method: 'DELETE',
      }),

    toggleFavorite: (carId: string) =>
      request<{ favorited: boolean; count: number }>('/api/user/favorites/toggle', {
        method: 'POST',
        body: JSON.stringify({ carId }),
      }),

    deleteAccount: () =>
      request<{ message: string }>('/api/user/account', {
        method: 'DELETE',
      }),
  },
};
