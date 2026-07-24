/**
 * Admin API Services
 * 
 * API calls for admin operations.
 */

import apiClient from '@/services/api';
import {
  AdminStats,
  AdminUser,
  AdminStore,
  AdminProduct,
  AdminOrder,
  ExchangeRate,
  PriceProvider,
  Transaction,
  AuditLog,
  SystemHealth,
  PlatformSettings,
} from '../types';

// ===========================================
// DASHBOARD
// ===========================================

export const adminDashboardApi = {
  async getStats(): Promise<AdminStats> {
    const response = await apiClient.get('/admin/dashboard/stats');
    return response.data.data;
  },

  async getRevenueChart(period: string): Promise<any[]> {
    const response = await apiClient.get('/admin/dashboard/revenue', { params: { period } });
    return response.data.data;
  },
};

// ===========================================
// USERS
// ===========================================

export const adminUsersApi = {
  async getUsers(params: {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: AdminUser[]; total: number }> {
    const response = await apiClient.get('/admin/users', { params });
    return response.data.data;
  },

  async getUser(id: string): Promise<AdminUser> {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data.data;
  },

  async updateUserStatus(id: string, status: string): Promise<AdminUser> {
    const response = await apiClient.put(`/admin/users/${id}/status`, { status });
    return response.data.data;
  },

  async updateUserRole(id: string, role: string): Promise<AdminUser> {
    const response = await apiClient.put(`/admin/users/${id}/role`, { role });
    return response.data.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`);
  },
};

// ===========================================
// STORES
// ===========================================

export const adminStoresApi = {
  async getStores(params: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ stores: AdminStore[]; total: number }> {
    const response = await apiClient.get('/admin/stores', { params });
    return response.data.data;
  },

  async getStore(id: string): Promise<AdminStore> {
    const response = await apiClient.get(`/admin/stores/${id}`);
    return response.data.data;
  },

  async approveStore(id: string): Promise<AdminStore> {
    const response = await apiClient.put(`/admin/stores/${id}/approve`);
    return response.data.data;
  },

  async rejectStore(id: string, reason?: string): Promise<AdminStore> {
    const response = await apiClient.put(`/admin/stores/${id}/reject`, { reason });
    return response.data.data;
  },

  async suspendStore(id: string, reason?: string): Promise<AdminStore> {
    const response = await apiClient.put(`/admin/stores/${id}/suspend`, { reason });
    return response.data.data;
  },

  async deleteStore(id: string): Promise<void> {
    await apiClient.delete(`/admin/stores/${id}`);
  },
};

// ===========================================
// PRODUCTS
// ===========================================

export const adminProductsApi = {
  async getProducts(params: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: AdminProduct[]; total: number }> {
    const response = await apiClient.get('/admin/products', { params });
    return response.data.data;
  },

  async updateProductStatus(id: string, status: string): Promise<AdminProduct> {
    const response = await apiClient.put(`/admin/products/${id}/status`, { status });
    return response.data.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/admin/products/${id}`);
  },
};

// ===========================================
// ORDERS
// ===========================================

export const adminOrdersApi = {
  async getOrders(params: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: AdminOrder[]; total: number }> {
    const response = await apiClient.get('/admin/orders', { params });
    return response.data.data;
  },

  async getOrder(id: string): Promise<AdminOrder> {
    const response = await apiClient.get(`/admin/orders/${id}`);
    return response.data.data;
  },

  async cancelOrder(id: string, reason?: string): Promise<void> {
    await apiClient.put(`/admin/orders/${id}/cancel`, { reason });
  },

  async refundOrder(id: string, amount?: number): Promise<void> {
    await apiClient.put(`/admin/orders/${id}/refund`, { amount });
  },
};

// ===========================================
// PRICING
// ===========================================

export const adminPricingApi = {
  async getExchangeRates(): Promise<ExchangeRate[]> {
    const response = await apiClient.get('/admin/pricing/exchange-rates');
    return response.data.data;
  },

  async updateExchangeRate(id: string, rate: number): Promise<ExchangeRate> {
    const response = await apiClient.put(`/admin/pricing/exchange-rates/${id}`, { rate });
    return response.data.data;
  },

  async getPriceProviders(): Promise<PriceProvider[]> {
    const response = await apiClient.get('/admin/pricing/providers');
    return response.data.data;
  },

  async toggleProvider(id: string, enabled: boolean): Promise<void> {
    await apiClient.put(`/admin/pricing/providers/${id}/toggle`, { enabled });
  },
};

// ===========================================
// PAYMENTS
// ===========================================

export const adminPaymentsApi = {
  async getTransactions(params: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ transactions: Transaction[]; total: number }> {
    const response = await apiClient.get('/admin/payments/transactions', { params });
    return response.data.data;
  },
};

// ===========================================
// AUDIT LOGS
// ===========================================

export const adminLogsApi = {
  async getAuditLogs(params: {
    action?: string;
    entity?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ logs: AuditLog[]; total: number }> {
    const response = await apiClient.get('/admin/logs/audit', { params });
    return response.data.data;
  },
};

// ===========================================
// MONITORING
// ===========================================

export const adminMonitoringApi = {
  async getSystemHealth(): Promise<SystemHealth> {
    const response = await apiClient.get('/admin/monitoring/health');
    return response.data.data;
  },
};

// ===========================================
// SETTINGS
// ===========================================

export const adminSettingsApi = {
  async getSettings(): Promise<PlatformSettings> {
    const response = await apiClient.get('/admin/settings');
    return response.data.data;
  },

  async updateSettings(section: string, data: any): Promise<PlatformSettings> {
    const response = await apiClient.put(`/admin/settings/${section}`, data);
    return response.data.data;
  },
};
