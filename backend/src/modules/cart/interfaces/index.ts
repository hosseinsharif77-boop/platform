/**
 * Cart and Checkout Interfaces
 * 
 * Core TypeScript interfaces for cart and checkout.
 */

// ===========================================
// CART TYPES
// ===========================================

export enum CartStatus {
  ACTIVE = 'active',
  MERGED = 'merged',
  ABANDONED = 'abandoned',
  CHECKOUT = 'checkout',
  COMPLETED = 'completed',
}

export interface CartItem {
  _id?: string;
  productId: string;
  productName: string;
  productSlug?: string;
  productImage?: string;
  storeId: string;
  storeName?: string;
  
  quantity: number;
  unitPrice: number;
  currentPrice: number;
  priceValid: boolean;
  priceChanged: boolean;
  priceDifference?: number;
  
  sku: string;
  inStock: boolean;
  availableQuantity: number;
  
  addedAt: Date;
  updatedAt: Date;
}

export interface Cart {
  _id: string;
  userId?: string;
  sessionId?: string;
  
  items: CartItem[];
  
  // Grouped by store
  storeGroups: CartStoreGroup[];
  
  // Totals
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  
  // Metadata
  itemCount: number;
  currency: string;
  status: CartStatus;
  
  // Price validation
  lastValidatedAt?: Date;
  hasPriceChanges: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface CartStoreGroup {
  storeId: string;
  storeName: string;
  items: CartItem[];
  subtotal: number;
}

// ===========================================
// PRICE LOCK TYPES
// ===========================================

export enum PriceLockStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface PriceLockItem {
  productId: string;
  productName: string;
  quantity: number;
  lockedPrice: number;
  originalPrice: number;
}

export interface PriceLock {
  _id: string;
  userId: string;
  sessionId?: string;
  
  items: PriceLockItem[];
  
  lockedAt: Date;
  expiresAt: Date;
  durationMinutes: number;
  
  status: PriceLockStatus;
  
  // Order association (after completion)
  orderId?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// ===========================================
// CHECKOUT TYPES
// ===========================================

export enum CheckoutStep {
  INFORMATION = 'information',
  SHIPPING = 'shipping',
  SHIPPING_METHOD = 'shipping_method',
  PAYMENT = 'payment',
  REVIEW = 'review',
}

export enum CheckoutStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
  EXPIRED = 'expired',
}

export interface CheckoutSession {
  _id: string;
  userId: string;
  cartId: string;
  priceLockId: string;
  
  currentStep: CheckoutStep;
  status: CheckoutStatus;
  
  // Customer info
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  
  // Shipping
  shippingAddressId?: string;
  shippingAddress?: any;
  shippingMethodId?: string;
  shippingMethod?: ShippingMethod;
  shippingCost: number;
  
  // Billing
  billingAddressId?: string;
  billingAddress?: any;
  sameAsShipping: boolean;
  
  // Totals
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  
  // Metadata
  notes?: string;
  currency: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// ===========================================
// SHIPPING TYPES
// ===========================================

export interface ShippingMethod {
  _id: string;
  name: string;
  description?: string;
  estimatedDays: {
    min: number;
    max: number;
  };
  cost: number;
  freeOver?: number;
  isActive: boolean;
}

export interface ShippingAddress {
  _id?: string;
  label?: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

// ===========================================
// CART VALIDATION TYPES
// ===========================================

export interface CartValidationResult {
  valid: boolean;
  items: CartItemValidation[];
  summary: {
    totalItems: number;
    validItems: number;
    invalidItems: number;
    priceChanges: number;
  };
}

export interface CartItemValidation {
  itemId: string;
  productId: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
  
  // Current state
  currentPrice: number;
  cartPrice: number;
  inStock: boolean;
  availableQuantity: number;
  productStatus: string;
}

// ===========================================
// API REQUEST/RESPONSE TYPES
// ===========================================

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CheckoutPreviewRequest {
  shippingAddressId?: string;
  shippingMethodId?: string;
  couponCode?: string;
}

export interface CheckoutPreviewResponse {
  items: CartItem[];
  shippingMethods: ShippingMethod[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  priceLockExpiresAt?: Date;
}
