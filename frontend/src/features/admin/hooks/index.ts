/**
 * Admin Hooks
 * 
 * React hooks for admin operations.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  adminDashboardApi,
  adminUsersApi,
  adminStoresApi,
  adminProductsApi,
  adminOrdersApi,
  adminLogsApi,
  adminMonitoringApi,
} from '../services';
import {
  AdminStats,
  AdminUser,
  AdminStore,
  AdminProduct,
  AdminOrder,
  AuditLog,
  SystemHealth,
} from '../types';

// ===========================================
// USE ADMIN STATS
// ===========================================

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await adminDashboardApi.getStats();
        setStats(result);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
}

// ===========================================
// USE USERS
// ===========================================

export function useAdminUsers(params: {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
} = {}) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminUsersApi.getUsers({ ...params, limit: 20 });
      setUsers(result.users);
      setTotal(result.total);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [params.role, params.status, params.search, params.page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, total, loading, refetch: fetchUsers };
}

// ===========================================
// USE STORES
// ===========================================

export function useAdminStores(params: {
  status?: string;
  search?: string;
  page?: number;
} = {}) {
  const [stores, setStores] = useState<AdminStore[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminStoresApi.getStores({ ...params, limit: 20 });
      setStores(result.stores);
      setTotal(result.total);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    } finally {
      setLoading(false);
    }
  }, [params.status, params.search, params.page]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return { stores, total, loading, refetch: fetchStores };
}

// ===========================================
// USE ORDERS
// ===========================================

export function useAdminOrders(params: {
  status?: string;
  search?: string;
  page?: number;
} = {}) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminOrdersApi.getOrders({ ...params, limit: 20 });
      setOrders(result.orders);
      setTotal(result.total);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [params.status, params.search, params.page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, total, loading, refetch: fetchOrders };
}

// ===========================================
// USE AUDIT LOGS
// ===========================================

export function useAuditLogs(params: {
  action?: string;
  entity?: string;
  page?: number;
} = {}) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminLogsApi.getAuditLogs({ ...params, limit: 50 });
      setLogs(result.logs);
      setTotal(result.total);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  }, [params.action, params.entity, params.page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, total, loading, refetch: fetchLogs };
}

// ===========================================
// USE SYSTEM HEALTH
// ===========================================

export function useSystemHealth() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const result = await adminMonitoringApi.getSystemHealth();
        setHealth(result);
      } catch (err) {
        console.error('Failed to fetch system health:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Refresh every 30s

    return () => clearInterval(interval);
  }, []);

  return { health, loading };
}
