/**
 * Pricing Interfaces
 * 
 * Core TypeScript interfaces for the pricing engine.
 */

// ===========================================
// PRICE TYPES
// ===========================================

export interface PriceAmount {
  amount: number;
  currency: string;
  formatted: string;
}

export interface CalculatedPrice {
  productId: string;
  storeId: string;
  basePrice: number;
  exchangeRate: number;
  currency: string;
  
  // Components
  components: PriceComponent[];
  
  // Final
  finalPrice: number;
  formattedPrice: string;
  
  // Metadata
  version: number;
  calculatedAt: Date;
  cached: boolean;
  lockId?: string;
}

export interface PriceComponent {
  type: 'base' | 'exchange' | 'markup' | 'discount' | 'fixed' | 'tax' | 'fee';
  label: string;
  value: number;
  percentage?: number;
  applied: boolean;
}

// ===========================================
// PRICING RULE TYPES
// ===========================================

export enum PricingRuleType {
  MARKUP_PERCENTAGE = 'markup_percentage',
  MARKUP_FIXED = 'markup_fixed',
  DISCOUNT_PERCENTAGE = 'discount_percentage',
  DISCOUNT_FIXED = 'discount_fixed',
  DYNAMIC = 'dynamic',
  COMPETITIVE = 'competitive',
  TIME_BASED = 'time_based',
  VOLUME_BASED = 'volume_based',
  SEGMENT_BASED = 'segment_based',
}

export enum PricingRuleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SCHEDULED = 'scheduled',
  EXPIRED = 'expired',
}

export interface PricingCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'between' | 'in' | 'contains';
  value: any;
}

export interface PricingAction {
  type: PricingRuleType;
  value: number;
  minValue?: number;
  maxValue?: number;
}

export interface IPricingRule {
  _id: string;
  storeId: string;
  productId?: string; // null means applies to all products
  
  name: string;
  description?: string;
  
  type: PricingRuleType;
  status: PricingRuleStatus;
  priority: number;
  
  conditions: PricingCondition[];
  actions: PricingAction[];
  
  // Scheduling
  startDate?: Date;
  endDate?: Date;
  
  // Usage
  usageLimit?: number;
  usageCount: number;
  
  // Audit
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===========================================
// EXCHANGE RATE TYPES
// ===========================================

export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  source: string;
  timestamp: Date;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  symbolPosition: 'before' | 'after';
  decimalPlaces: number;
  thousandsSeparator: string;
  decimalSeparator: string;
}

// ===========================================
// PRICE HISTORY TYPES
// ===========================================

export enum PriceChangeReason {
  EXCHANGE_RATE = 'exchange_rate',
  RULE_APPLICATION = 'rule_application',
  MANUAL_OVERRIDE = 'manual_override',
  SCHEDULED_UPDATE = 'scheduled_update',
  ROLLBACK = 'rollback',
  SYSTEM = 'system',
}

export interface PriceHistoryEntry {
  _id: string;
  productId: string;
  storeId: string;
  variantId?: string;
  
  // Price snapshot
  oldPrice: number;
  newPrice: number;
  currency: string;
  exchangeRate: number;
  
  // Change info
  reason: PriceChangeReason;
  description?: string;
  
  // Version
  version: number;
  
  // Audit
  changedBy?: string;
  changedByType: 'system' | 'seller' | 'admin';
  
  // Metadata
  metadata?: Record<string, any>;
  
  createdAt: Date;
}

// ===========================================
// PRICE VERSIONING TYPES
// ===========================================

export interface PriceVersion {
  _id: string;
  productId: string;
  storeId: string;
  
  version: number;
  price: number;
  currency: string;
  
  // Snapshot
  basePrice: number;
  exchangeRate: number;
  appliedRules: string[];
  
  // Rollback support
  previousVersion?: number;
  canRollback: boolean;
  
  // Audit
  createdBy: string;
  createdAt: Date;
}

// ===========================================
// PRICE LOCK TYPES
// ===========================================

export interface PriceLock {
  _id: string;
  productId: string;
  storeId: string;
  variantId?: string;
  
  userId: string;
  lockedPrice: number;
  currency: string;
  
  // Expiration
  expiresAt: Date;
  isActive: boolean;
  
  // Order association
  orderId?: string;
  
  createdAt: Date;
}

// ===========================================
// PROVIDER TYPES
// ===========================================

export interface PriceProvider {
  name: string;
  priority: number;
  
  getExchangeRate(from: string, to: string): Promise<number>;
  getSupportedCurrencies(): string[];
  isAvailable(): Promise<boolean>;
}

export interface PriceCalculationContext {
  productId: string;
  storeId: string;
  variantId?: string;
  
  basePrice: number;
  currency: string;
  targetCurrency: string;
  
  // Optional context
  quantity?: number;
  customerId?: string;
  customerSegment?: string;
  
  // Override
  forceRecalculate?: boolean;
  ignoreCache?: boolean;
}

// ===========================================
// CACHE TYPES
// ===========================================

export interface CacheConfig {
  ttl: number;
  prefix: string;
  invalidateOn: string[];
}

export interface CachedPrice {
  price: CalculatedPrice;
  cachedAt: Date;
  expiresAt: Date;
}

// ===========================================
// EVENT TYPES
// ===========================================

export interface PricingEvent {
  type: string;
  productId: string;
  storeId: string;
  
  data: any;
  timestamp: Date;
  userId?: string;
}

export interface PriceUpdateEvent extends PricingEvent {
  type: 'price.updated';
  data: {
    oldPrice: number;
    newPrice: number;
    reason: PriceChangeReason;
    version: number;
  };
}

export interface ExchangeRateUpdatedEvent extends PricingEvent {
  type: 'exchange.rate.updated';
  data: {
    fromCurrency: string;
    toCurrency: string;
    oldRate: number;
    newRate: number;
  };
}

// ===========================================
// API TYPES
// ===========================================

export interface CalculatePriceRequest {
  productId: string;
  storeId: string;
  variantId?: string;
  quantity?: number;
  currency?: string;
  customerId?: string;
}

export interface BulkCalculatePriceRequest {
  items: CalculatePriceRequest[];
  currency?: string;
}

export interface PriceLockRequest {
  productId: string;
  storeId: string;
  variantId?: string;
  durationMinutes?: number;
}

export interface PriceRollbackRequest {
  productId: string;
  storeId: string;
  targetVersion: number;
  reason?: string;
}

export interface PricingRuleCreateRequest {
  storeId: string;
  productId?: string;
  name: string;
  description?: string;
  type: PricingRuleType;
  priority?: number;
  conditions: PricingCondition[];
  actions: PricingAction[];
  startDate?: string;
  endDate?: string;
}
