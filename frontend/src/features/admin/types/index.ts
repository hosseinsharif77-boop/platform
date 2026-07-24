/**
 * Admin Types
 * 
 * TypeScript types for the admin panel.
 */

// ===========================================
// ADMIN STATS
// ===========================================

export interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  totalCustomers: number;
  totalStores: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingApprovals: number;
  
  // Changes
  usersChange: number;
  sellersChange: number;
  storesChange: number;
  ordersChange: number;
  revenueChange: number;
  
  // System
  systemHealth: 'healthy' | 'degraded' | 'down';
  exchangeRateStatus: 'active' | 'error';
  queueStatus: 'healthy' | 'backlog' | 'down';
}

export interface ChartData {
  date: string;
  value: number;
}

// ===========================================
// USER TYPES
// ===========================================

export enum UserRole {
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  MANAGER = 'manager',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
}

export interface AdminUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  storeCount?: number;
  orderCount?: number;
}

// ===========================================
// STORE TYPES
// ===========================================

export enum StoreStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  REJECTED = 'rejected',
}

export interface AdminStore {
  _id: string;
  name: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  status: StoreStatus;
  productCount: number;
  orderCount: number;
  revenue: number;
  rating: number;
  createdAt: string;
}

// ===========================================
// PRODUCT TYPES
// ===========================================

export interface AdminProduct {
  _id: string;
  name: string;
  sku: string;
  storeName: string;
  categoryName: string;
  price: number;
  stock: number;
  status: string;
  createdAt: string;
}

// ===========================================
// ORDER TYPES
// ===========================================

export enum AdminOrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  storeName: string;
  items: number;
  total: number;
  status: AdminOrderStatus;
  paymentStatus: string;
  createdAt: string;
}

// ===========================================
// PRICING TYPES
// ===========================================

export interface ExchangeRate {
  _id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  source: string;
  lastUpdated: string;
}

export interface PriceProvider {
  _id: string;
  name: string;
  status: 'active' | 'error' | 'disabled';
  lastSync?: string;
  error?: string;
}

// ===========================================
// PAYMENT TYPES
// ===========================================

export interface Transaction {
  _id: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
}

// ===========================================
// LOG TYPES
// ===========================================

export enum AuditAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
}

export interface AuditLog {
  _id: string;
  userId: string;
  userName: string;
  action: AuditAction;
  entity: string;
  entityId?: string;
  changes?: any;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

// ===========================================
// MONITORING TYPES
// ===========================================

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  services: {
    mongodb: 'up' | 'down';
    redis: 'up' | 'down';
    queue: 'up' | 'down';
  };
  memory: {
    heapUsed: number;
    heapTotal: number;
  };
  cpu: {
    user: number;
    system: number;
  };
}

// ===========================================
// SETTINGS TYPES
// ===========================================

export interface PlatformSettings {
  general: {
    siteName: string;
    siteUrl: string;
    logo?: string;
    favicon?: string;
    maintenanceMode: boolean;
  };
  marketplace: {
    allowRegistration: boolean;
    requireEmailVerification: boolean;
    requireStoreApproval: boolean;
    maxProductsPerStore: number;
  };
  pricing: {
    autoUpdateEnabled: boolean;
    updateIntervalMinutes: number;
    defaultCurrency: string;
    priceLockDurationMinutes: number;
  };
  shipping: {
    enabled: boolean;
    defaultShippingCost: number;
    freeShippingThreshold: number;
  };
  email: {
    enabled: boolean;
    provider: string;
    fromName: string;
    fromEmail: string;
  };
  security: {
    maxLoginAttempts: number;
    lockoutDurationMinutes: number;
    sessionTimeoutMinutes: number;
  };
}
