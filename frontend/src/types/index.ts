/**
 * Type Definitions
 * 
 * Shared TypeScript types for the frontend application.
 */

// ===========================================
// API Types
// ===========================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: {
    message: string;
    statusCode: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ===========================================
// Auth Types
// ===========================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: 'customer' | 'vendor';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

// ===========================================
// Store Types
// ===========================================

export interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  ownerId: string;
  status: StoreStatus;
  settings: StoreSettings;
  createdAt: string;
  updatedAt: string;
}

export enum StoreStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export interface StoreSettings {
  currency: string;
  timezone: string;
  taxRate: number;
  shippingEnabled: boolean;
}

// ===========================================
// Product Types
// ===========================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  inventory: number;
  storeId: string;
  categoryId?: string;
  images: string[];
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export enum ProductStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
}

// ===========================================
// Pricing Types
// ===========================================

export interface PricingRule {
  id: string;
  name: string;
  type: PricingRuleType;
  conditions: PricingCondition[];
  actions: PricingAction[];
  priority: number;
  isActive: boolean;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}

export enum PricingRuleType {
  DYNAMIC = 'dynamic',
  DISCOUNT = 'discount',
  MARKUP = 'markup',
  COMPETITIVE = 'competitive',
}

export interface PricingCondition {
  field: string;
  operator: 'equals' | 'greaterThan' | 'lessThan' | 'between' | 'in';
  value: any;
}

export interface PricingAction {
  type: 'set' | 'increase' | 'decrease' | 'percentage';
  value: number;
}
