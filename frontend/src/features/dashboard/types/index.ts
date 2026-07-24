/**
 * Dashboard Types
 * 
 * TypeScript types for the seller dashboard.
 */

// ===========================================
// DASHBOARD STATS
// ===========================================

export interface DashboardStats {
  todaySales: number;
  todayOrders: number;
  todayRevenue: number;
  totalProducts: number;
  lowStockProducts: number;
  
  // Comparisons
  salesChange: number;
  ordersChange: number;
  revenueChange: number;
  
  // Charts
  salesChart: ChartData[];
  revenueChart: ChartData[];
  ordersChart: ChartData[];
}

export interface ChartData {
  date: string;
  value: number;
  label?: string;
}

// ===========================================
// ORDER TYPES
// ===========================================

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface DashboardOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// ===========================================
// PRODUCT TYPES
// ===========================================

export interface DashboardProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  livePrice?: number;
  stock: number;
  status: string;
  image?: string;
  categoryName?: string;
  lastPriceUpdate?: string;
  createdAt: string;
}

// ===========================================
// INVENTORY TYPES
// ===========================================

export interface InventoryItem {
  _id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  minimumStock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
}

export interface StockHistory {
  _id: string;
  productId: string;
  change: number;
  reason: string;
  timestamp: string;
}

// ===========================================
// PRICING TYPES
// ===========================================

export interface PriceRule {
  _id: string;
  name: string;
  type: 'markup' | 'discount' | 'fixed' | 'dynamic';
  value: number;
  status: 'active' | 'inactive';
  productsCount: number;
  createdAt: string;
}

export interface PriceHistoryEntry {
  _id: string;
  productId: string;
  productName: string;
  oldPrice: number;
  newPrice: number;
  reason: string;
  changedBy: string;
  timestamp: string;
}

// ===========================================
// NOTIFICATION TYPES
// ===========================================

export interface DashboardNotification {
  _id: string;
  type: 'order' | 'stock' | 'price' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

// ===========================================
// ANALYTICS TYPES
// ===========================================

export interface AnalyticsData {
  sales: {
    total: number;
    change: number;
    data: ChartData[];
  };
  revenue: {
    total: number;
    change: number;
    data: ChartData[];
  };
  orders: {
    total: number;
    change: number;
    data: ChartData[];
  };
  topProducts: TopProduct[];
  recentCustomers: Customer[];
}

export interface TopProduct {
  _id: string;
  name: string;
  image?: string;
  sold: number;
  revenue: number;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
}

// ===========================================
// SETTINGS TYPES
// ===========================================

export interface StoreSettings {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  contactEmail: string;
  contactPhone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  businessHours: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];
  shippingSettings: {
    enabled: boolean;
    freeShippingThreshold?: number;
    defaultShippingCost: number;
  };
}

export interface SellerProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}
