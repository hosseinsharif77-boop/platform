/**
 * Dashboard API Services
 * 
 * API calls for dashboard operations.
 */

import apiClient from '@/services/api';
import {
  DashboardStats,
  DashboardOrder,
  DashboardProduct,
  InventoryItem,
  PriceRule,
  PriceHistoryEntry,
  DashboardNotification,
  AnalyticsData,
  StoreSettings,
  SellerProfile,
} from '../types';

// ===========================================
// DASHBOARD STATS
// ===========================================

export const dashboardApi = {
  /**
   * Get dashboard stats
   */
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get('/seller/dashboard/stats');
    return response.data.data;
  },

  /**
   * Get recent activity
   */
  async getRecentActivity(limit = 10): Promise<any[]> {
    const response = await apiClient.get('/seller/dashboard/activity', {
      params: { limit },
    });
    return response.data.data;
  },
};

// ===========================================
// ORDERS API
// ===========================================

export const ordersApi = {
  /**
   * Get orders list
   */
  async getOrders(params: {
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ orders: DashboardOrder[]; total: number }> {
    const response = await apiClient.get('/seller/orders', { params });
    return response.data.data;
  },

  /**
   * Get order details
   */
  async getOrder(id: string): Promise<DashboardOrder> {
    const response = await apiClient.get(`/seller/orders/${id}`);
    return response.data.data;
  },

  /**
   * Update order status
   */
  async updateStatus(id: string, status: string): Promise<DashboardOrder> {
    const response = await apiClient.put(`/seller/orders/${id}/status`, { status });
    return response.data.data;
  },
};

// ===========================================
// PRODUCTS API
// ===========================================

export const productsApi = {
  /**
   * Get products list
   */
  async getProducts(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: string;
  }): Promise<{ products: DashboardProduct[]; total: number }> {
    const response = await apiClient.get('/seller/products', { params });
    return response.data.data;
  },

  /**
   * Get product details
   */
  async getProduct(id: string): Promise<DashboardProduct> {
    const response = await apiClient.get(`/seller/products/${id}`);
    return response.data.data;
  },

  /**
   * Create product
   */
  async createProduct(data: any): Promise<DashboardProduct> {
    const response = await apiClient.post('/seller/products', data);
    return response.data.data;
  },

  /**
   * Update product
   */
  async updateProduct(id: string, data: any): Promise<DashboardProduct> {
    const response = await apiClient.put(`/seller/products/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete product
   */
  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/seller/products/${id}`);
  },

  /**
   * Bulk update products
   */
  async bulkUpdate(ids: string[], data: any): Promise<void> {
    await apiClient.post('/seller/products/bulk', { ids, ...data });
  },
};

// ===========================================
// INVENTORY API
// ===========================================

export const inventoryApi = {
  /**
   * Get inventory list
   */
  async getInventory(params: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: InventoryItem[]; total: number }> {
    const response = await apiClient.get('/seller/inventory', { params });
    return response.data.data;
  },

  /**
   * Update stock
   */
  async updateStock(productId: string, data: {
    currentStock: number;
    minimumStock?: number;
  }): Promise<InventoryItem> {
    const response = await apiClient.put(`/seller/inventory/${productId}`, data);
    return response.data.data;
  },

  /**
   * Get low stock alerts
   */
  async getLowStockAlerts(): Promise<InventoryItem[]> {
    const response = await apiClient.get('/seller/inventory/low-stock');
    return response.data.data;
  },

  /**
   * Get stock history
   */
  async getStockHistory(productId: string): Promise<any[]> {
    const response = await apiClient.get(`/seller/inventory/${productId}/history`);
    return response.data.data;
  },
};

// ===========================================
// PRICING API
// ===========================================

export const pricingApi = {
  /**
   * Get price rules
   */
  async getPriceRules(): Promise<PriceRule[]> {
    const response = await apiClient.get('/seller/pricing/rules');
    return response.data.data;
  },

  /**
   * Create price rule
   */
  async createPriceRule(data: any): Promise<PriceRule> {
    const response = await apiClient.post('/seller/pricing/rules', data);
    return response.data.data;
  },

  /**
   * Update price rule
   */
  async updatePriceRule(id: string, data: any): Promise<PriceRule> {
    const response = await apiClient.put(`/seller/pricing/rules/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete price rule
   */
  async deletePriceRule(id: string): Promise<void> {
    await apiClient.delete(`/seller/pricing/rules/${id}`);
  },

  /**
   * Get price history
   */
  async getPriceHistory(params?: {
    productId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ history: PriceHistoryEntry[]; total: number }> {
    const response = await apiClient.get('/seller/pricing/history', { params });
    return response.data.data;
  },

  /**
   * Toggle live pricing
   */
  async toggleLivePricing(productId: string, enabled: boolean): Promise<void> {
    await apiClient.put(`/seller/products/${productId}/live-pricing`, { enabled });
  },

  /**
   * Manual price override
   */
  async overridePrice(productId: string, price: number): Promise<void> {
    await apiClient.put(`/seller/products/${productId}/price`, { price });
  },
};

// ===========================================
// NOTIFICATIONS API
// ===========================================

export const notificationsApi = {
  /**
   * Get notifications
   */
  async getNotifications(params?: {
    unreadOnly?: boolean;
    limit?: number;
  }): Promise<{ notifications: DashboardNotification[]; unreadCount: number }> {
    const response = await apiClient.get('/seller/notifications', { params });
    return response.data.data;
  },

  /**
   * Mark as read
   */
  async markAsRead(id: string): Promise<void> {
    await apiClient.put(`/seller/notifications/${id}/read`);
  },

  /**
   * Mark all as read
   */
  async markAllAsRead(): Promise<void> {
    await apiClient.put('/seller/notifications/read-all');
  },
};

// ===========================================
// ANALYTICS API
// ===========================================

export const analyticsApi = {
  /**
   * Get analytics data
   */
  async getAnalytics(params: {
    period?: 'day' | 'week' | 'month' | 'year';
    startDate?: string;
    endDate?: string;
  }): Promise<AnalyticsData> {
    const response = await apiClient.get('/seller/analytics', { params });
    return response.data.data;
  },

  /**
   * Get sales report
   */
  async getSalesReport(params: {
    startDate: string;
    endDate: string;
    groupBy?: 'day' | 'week' | 'month';
  }): Promise<any[]> {
    const response = await apiClient.get('/seller/analytics/sales', { params });
    return response.data.data;
  },
};

// ===========================================
// STORE API
// ===========================================

export const storeApi = {
  /**
   * Get store settings
   */
  async getSettings(): Promise<StoreSettings> {
    const response = await apiClient.get('/seller/store/settings');
    return response.data.data;
  },

  /**
   * Update store settings
   */
  async updateSettings(data: Partial<StoreSettings>): Promise<StoreSettings> {
    const response = await apiClient.put('/seller/store/settings', data);
    return response.data.data;
  },

  /**
   * Upload logo
   */
  async uploadLogo(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/seller/store/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  /**
   * Upload banner
   */
  async uploadBanner(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/seller/store/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};

// ===========================================
// PROFILE API
// ===========================================

export const profileApi = {
  /**
   * Get profile
   */
  async getProfile(): Promise<SellerProfile> {
    const response = await apiClient.get('/seller/profile');
    return response.data.data;
  },

  /**
   * Update profile
   */
  async updateProfile(data: Partial<SellerProfile>): Promise<SellerProfile> {
    const response = await apiClient.put('/seller/profile', data);
    return response.data.data;
  },

  /**
   * Update password
   */
  async updatePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await apiClient.put('/seller/profile/password', data);
  },

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/seller/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};
