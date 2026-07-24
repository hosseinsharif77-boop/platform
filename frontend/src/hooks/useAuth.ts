/**
 * Use Auth Hook
 * 
 * Custom hook for authentication logic.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services';

export const useAuth = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, error, setUser, setLoading, setError, login, logout } =
    useAuthStore();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token && !isAuthenticated) {
        setLoading(true);
        try {
          const user = await authService.getMe();
          setUser(user);
        } catch (err) {
          console.error('Auth check failed:', err);
          logout();
        } finally {
          setLoading(false);
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, setUser, setLoading, logout]);

  // Login function
  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });
      login(response.user, response.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const handleRegister = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register({ email, password, name });
      login(response.user, response.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      logout();
      router.push('/');
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};
