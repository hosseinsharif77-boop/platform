/**
 * API Endpoints
 * 
 * Centralized API endpoint definitions.
 */

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  // Users
  USERS: {
    BASE: '/users',
    ME: '/users/me',
    UPDATE_PROFILE: '/users/me/profile',
    CHANGE_PASSWORD: '/users/me/password',
  },

  // Stores
  STORES: {
    BASE: '/stores',
    MY_STORE: '/stores/my-store',
    CREATE: '/stores',
    UPDATE: (id: string) => `/stores/${id}`,
    DELETE: (id: string) => `/stores/${id}`,
  },

  // Products
  PRODUCTS: {
    BASE: '/products',
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    BY_STORE: (storeId: string) => `/stores/${storeId}/products`,
  },

  // Pricing
  PRICING: {
    BASE: '/pricing',
    CALCULATE: '/pricing/calculate',
    BULK_UPDATE: '/pricing/bulk-update',
    HISTORY: (productId: string) => `/pricing/history/${productId}`,
  },

  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    SALES: '/analytics/sales',
    PRODUCTS: '/analytics/products',
    STORES: '/analytics/stores',
  },
} as const;
