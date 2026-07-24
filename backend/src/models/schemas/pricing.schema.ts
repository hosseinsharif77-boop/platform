/**
 * Pricing Schemas
 * 
 * Dynamic pricing engine schemas including:
 * - PricingRule: Rules for automatic price calculations
 * - PriceHistory: Audit trail of price changes
 * - PriceLock: Temporary price locks for customers
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../plugins/audit';
import { toJSONPlugin } from '../plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export enum PricingRuleType {
  MARKUP = 'markup',
  DISCOUNT = 'discount',
  DYNAMIC = 'dynamic',
  COMPETITIVE = 'competitive',
  TIME_BASED = 'time_based',
  VOLUME = 'volume',
  SEGMENT = 'segment',
}

export enum PricingRuleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
}

export interface IPricingCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'between' | 'in' | 'contains';
  value: any;
}

export interface IPricingAction {
  type: 'set' | 'increase' | 'decrease' | 'percentage';
  value: number;
  minValue?: number;
  maxValue?: number;
}

export interface IPricingRule extends AuditDocument {
  storeId: any;
  productId?: any;
  name: string;
  description?: string;
  type: PricingRuleType;
  status: PricingRuleStatus;
  priority: number;
  conditions: IPricingCondition[];
  actions: IPricingAction[];
  startDate?: Date;
  endDate?: Date;
  usageLimit?: number;
  usageCount: number;
  metadata: Record<string, any>;
}

export interface IPriceHistory extends Document {
  productId: any;
  storeId: any;
  variantId?: any;
  oldPrice: number;
  newPrice: number;
  currency: string;
  changeType: 'manual' | 'automatic' | 'rule' | 'exchange_rate';
  reason?: string;
  ruleId?: any;
  createdBy?: any;
  createdAt: Date;
}

export interface IPriceLock extends AuditDocument {
  productId: any;
  storeId: any;
  variantId?: any;
  userId: any;
  lockedPrice: number;
  currency: string;
  expiresAt: Date;
  isActive: boolean;
  orderId?: any;
}

export interface PricingRuleModel extends Model<IPricingRule> {
  findActiveByStore(storeId: string): Promise<IPricingRule[]>;
  findActiveByProduct(productId: string): Promise<IPricingRule[]>;
}

export interface PriceHistoryModel extends Model<IPriceHistory> {
  findByProduct(productId: string, limit?: number): Promise<IPriceHistory[]>;
}

export interface PriceLockModel extends Model<IPriceLock> {
  findActiveByProduct(productId: string): Promise<IPriceLock[]>;
  findActiveByUser(userId: string): Promise<IPriceLock[]>;
}

// ===========================================
// PRICING RULE SCHEMA
// ===========================================

const pricingConditionSchema = new Schema<IPricingCondition>({
  field: { type: String, required: true },
  operator: {
    type: String,
    required: true,
    enum: ['equals', 'not_equals', 'greater_than', 'less_than', 'between', 'in', 'contains'],
  },
  value: { type: Schema.Types.Mixed, required: true },
}, { _id: false });

const pricingActionSchema = new Schema<IPricingAction>({
  type: {
    type: String,
    required: true,
    enum: ['set', 'increase', 'decrease', 'percentage'],
  },
  value: { type: Number, required: true },
  minValue: { type: Number },
  maxValue: { type: Number },
}, { _id: false });

const pricingRuleSchema = new Schema<IPricingRule, PricingRuleModel>({
  // Store relationship
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
    index: true,
  },

  // Optional product association
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    sparse: true,
    index: true,
  },

  // Rule info
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    maxlength: 500,
  },

  // Rule configuration
  type: {
    type: String,
    enum: Object.values(PricingRuleType),
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: Object.values(PricingRuleStatus),
    default: PricingRuleStatus.ACTIVE,
    required: true,
    index: true,
  },
  priority: {
    type: Number,
    default: 0,
    index: true,
  },

  // Conditions & Actions
  conditions: [pricingConditionSchema],
  actions: [pricingActionSchema],

  // Scheduling
  startDate: {
    type: Date,
    index: true,
  },
  endDate: {
    type: Date,
    index: true,
  },

  // Usage tracking
  usageLimit: {
    type: Number,
    min: 0,
  },
  usageCount: {
    type: Number,
    default: 0,
    min: 0,
  },

  // Flexible metadata
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'pricing_rules',
});

// Indexes for pricing rules
pricingRuleSchema.index({ storeId: 1, status: 1, priority: -1 });
pricingRuleSchema.index({ productId: 1, status: 1 });
pricingRuleSchema.index({ startDate: 1, endDate: 1 });
pricingRuleSchema.index({ storeId: 1, type: 1, status: 1 });

// Static methods
pricingRuleSchema.statics.findActiveByStore = function (storeId: string) {
  const now = new Date();
  return this.find({
    storeId,
    status: PricingRuleStatus.ACTIVE,
    isDeleted: false,
    $or: [
      { startDate: { $exists: false } },
      { startDate: { $lte: now } },
    ],
    $or: [
      { endDate: { $exists: false } },
      { endDate: { $gte: now } },
    ],
  }).sort({ priority: -1 });
};

pricingRuleSchema.statics.findActiveByProduct = function (productId: string) {
  const now = new Date();
  return this.find({
    $or: [
      { productId },
      { productId: { $exists: false } },
    ],
    status: PricingRuleStatus.ACTIVE,
    isDeleted: false,
    $or: [
      { startDate: { $exists: false } },
      { startDate: { $lte: now } },
    ],
    $or: [
      { endDate: { $exists: false } },
      { endDate: { $gte: now } },
    ],
  }).sort({ priority: -1 });
};

// Apply plugins
pricingRuleSchema.plugin(auditPlugin);
pricingRuleSchema.plugin(toJSONPlugin);

// ===========================================
// PRICE HISTORY SCHEMA
// ===========================================

const priceHistorySchema = new Schema<IPriceHistory, PriceHistoryModel>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
    index: true,
  },
  variantId: {
    type: Schema.Types.ObjectId,
    sparse: true,
  },

  // Price change details
  oldPrice: {
    type: Number,
    required: true,
  },
  newPrice: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    maxlength: 3,
  },

  // Change tracking
  changeType: {
    type: String,
    enum: ['manual', 'automatic', 'rule', 'exchange_rate'],
    required: true,
    index: true,
  },
  reason: {
    type: String,
    maxlength: 500,
  },
  ruleId: {
    type: Schema.Types.ObjectId,
    ref: 'PricingRule',
    sparse: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'price_history',
});

// Indexes for price history (time-series optimized)
priceHistorySchema.index({ productId: 1, createdAt: -1 });
priceHistorySchema.index({ storeId: 1, createdAt: -1 });
priceHistorySchema.index({ productId: 1, storeId: 1, createdAt: -1 });

// Static methods
priceHistorySchema.statics.findByProduct = function (productId: string, limit = 50) {
  return this.find({ productId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Apply plugins
priceHistorySchema.plugin(toJSONPlugin);

// ===========================================
// PRICE LOCK SCHEMA
// ===========================================

const priceLockSchema = new Schema<IPriceLock, PriceLockModel>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
    index: true,
  },
  variantId: {
    type: Schema.Types.ObjectId,
    sparse: true,
  },

  // Lock info
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  lockedPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    maxlength: 3,
  },

  // Expiration
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },

  // Order association
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    sparse: true,
  },
}, {
  timestamps: true,
  collection: 'price_locks',
});

// Indexes for price locks
priceLockSchema.index({ productId: 1, userId: 1, isActive: 1 });
priceLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Static methods
priceLockSchema.statics.findActiveByProduct = function (productId: string) {
  return this.find({
    productId,
    isActive: true,
    expiresAt: { $gt: new Date() },
  });
};

priceLockSchema.statics.findActiveByUser = function (userId: string) {
  return this.find({
    userId,
    isActive: true,
    expiresAt: { $gt: new Date() },
  });
};

// Apply plugins
priceLockSchema.plugin(auditPlugin);
priceLockSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODELS
// ===========================================

export const PricingRule = Model.model<IPricingRule, PricingRuleModel>(
  'PricingRule',
  pricingRuleSchema
);

export const PriceHistory = Model.model<IPriceHistory, PriceHistoryModel>(
  'PriceHistory',
  priceHistorySchema
);

export const PriceLock = Model.model<IPriceLock, PriceLockModel>(
  'PriceLock',
  priceLockSchema
);

export default { PricingRule, PriceHistory, PriceLock };
