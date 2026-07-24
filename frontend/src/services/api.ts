/**
 * API Client
 * 
 * Axios instance configured for making API requests.
 */

import axios from 'axios';
import { config } from '@/config';

/**
 * Create Axios instance with default config
 */
const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Adds auth token to requests
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handles common response errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // TODO: Implement token refresh logic
      // const refreshToken = localStorage.getItem('refresh_token');
      // if (refreshToken) {
      //   const response = await axios.post(`${config.api.baseUrl}/auth/refresh`, {
      //     refreshToken,
      //   });
      //   const { token } = response.data.data;
      //   localStorage.setItem('auth_token', token);
      //   originalRequest.headers.Authorization = `Bearer ${token}`;
      //   return apiClient(originalRequest);
      // }

      // Redirect to login if no refresh token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
