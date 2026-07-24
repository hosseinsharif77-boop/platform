/**
 * Auth Service
 * 
 * Handles authentication-related API calls.
 */

import apiClient from './api';
import { API_ENDPOINTS } from '@/constants';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types';

export const authService = {
  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data.data;
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  },

  /**
   * Get current user
   */
  async getMe(): Promise<User> {
    const response = await apiClient.get(API_ENDPOINTS.USERS.ME);
    return response.data.data;
  },

  /**
   * Refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
    return response.data.data;
  },
};
