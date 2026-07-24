/**
 * Cart Types
 * 
 * TypeScript types for the cart module.
 */

export enum CartStatus {
  ACTIVE = 'active',
  MERGED = 'merged',
  ABANDONED = 'abandoned',
  CHECKOUT = 'checkout',
  COMPLETED = 'completed',
}

export interface CartItem {
  _id: string;
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
  
  addedAt: string;
  updatedAt: string;
}

export interface CartStoreGroup {
  storeId: string;
  storeName: string;
  items: CartItem[];
  subtotal: number;
}

export interface Cart {
  _id: string;
  userId?: string;
  sessionId?: string;
  
  items: CartItem[];
  storeGroups: CartStoreGroup[];
  
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  
  itemCount: number;
  currency: string;
  status: CartStatus;
  
  hasPriceChanges: boolean;
  
  createdAt: string;
  updatedAt: string;
}

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
  currentPrice: number;
  cartPrice: number;
  inStock: boolean;
  availableQuantity: number;
  productStatus: string;
}
