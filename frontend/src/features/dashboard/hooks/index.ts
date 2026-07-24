/**
 * Dashboard Hooks
 * 
 * React hooks for dashboard operations.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  dashboardApi,
  ordersApi,
  productsApi,
  inventoryApi,
  pricingApi,
  notificationsApi,
  analyticsApi,
} from '../services';
import {
  DashboardStats,
  DashboardOrder,
  DashboardProduct,
  InventoryItem,
  PriceRule,
  PriceHistoryEntry,
  DashboardNotification,
  AnalyticsData,
} from '../types';

// ===========================================
// USE DASHBOARD STATS
// ===========================================

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const result = await dashboardApi.getStats();
        setStats(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}

// ===========================================
// USE ORDERS
// ===========================================

export function useOrders(params: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await ordersApi.getOrders(params);
      setOrders(result.orders);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params.status, params.page, params.limit, params.search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, total, loading, error, refetch: fetchOrders };
}

// ===========================================
// USE PRODUCTS
// ===========================================

export function useProducts(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
} = {}) {
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await productsApi.getProducts(params);
      setProducts(result.products);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params.status, params.page, params.limit, params.search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, total, loading, error, refetch: fetchProducts };
}

// ===========================================
// USE INVENTORY
// ===========================================

export function useInventory(params: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const result = await inventoryApi.getInventory(params);
      setItems(result.items);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params.status, params.page, params.limit, params.search]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return { items, total, loading, error, refetch: fetchInventory };
}

// ===========================================
// USE NOTIFICATIONS
// ===========================================

export function useNotifications() {
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const result = await notificationsApi.getNotifications({ limit: 20 });
      setNotifications(result.notifications);
      setUnreadCount(result.unreadCount);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    await notificationsApi.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    await notificationsApi.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
}

// ===========================================
// USE ANALYTICS
// ===========================================

export function useAnalytics(period: 'day' | 'week' | 'month' | 'month' = 'week') {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const result = await analyticsApi.getAnalytics({ period });
        setData(result);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  return { data, loading };
}
