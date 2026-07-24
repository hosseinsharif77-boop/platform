/**
 * Pricing Rule Model
 * 
 * Defines pricing rules for stores and products.
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../../../models/plugins/audit';
import { softDeletePlugin, SoftDeleteDocument } from '../../../models/plugins/softDelete';
import { toJSONPlugin } from '../../../models/plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
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
}

export enum PricingRuleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SCHEDULED = 'scheduled',
  EXPIRED = 'expired',
}

export interface IPricingCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'between' | 'in';
  value: any;
}

export interface IPricingAction {
  type: PricingRuleType;
  value: number;
  minValue?: number;
  maxValue?: number;
}

export interface IPricingRule extends AuditDocument, SoftDeleteDocument {
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

export interface PricingRuleModel extends Model<IPricingRule> {
  findActiveByStore(storeId: string): Promise<IPricingRule[]>;
  findActiveByProduct(productId: string, storeId: string): Promise<IPricingRule[]>;
  findByStore(storeId: string): Promise<IPricingRule[]>;
}

// ===========================================
// SCHEMA DEFINITION
// ===========================================

const pricingConditionSchema = new Schema<IPricingCondition>({
  field: { type: String, required: true },
  operator: {
    type: String,
    required: true,
    enum: ['equals', 'not_equals', 'greater_than', 'less_than', 'between', 'in'],
  },
  value: { type: Schema.Types.Mixed, required: true },
}, { _id: false });

const pricingActionSchema = new Schema<IPricingAction>({
  type: {
    type: String,
    required: true,
    enum: Object.values(PricingRuleType),
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
    required: [true, 'Rule name is required'],
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

// ===========================================
// INDEXES
// ===========================================

// Compound indexes
pricingRuleSchema.index({ storeId: 1, status: 1, priority: -1 });
pricingRuleSchema.index({ storeId: 1, productId: 1, status: 1 });
pricingRuleSchema.index({ productId: 1, status: 1 });
pricingRuleSchema.index({ startDate: 1, endDate: 1 });

// ===========================================
// STATIC METHODS
// ===========================================

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

pricingRuleSchema.statics.findActiveByProduct = function (productId: string, storeId: string) {
  const now = new Date();
  return this.find({
    storeId,
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

pricingRuleSchema.statics.findByStore = function (storeId: string) {
  return this.find({ storeId, isDeleted: false }).sort({ priority: -1 });
};

// ===========================================
// APPLY PLUGINS
// ===========================================

pricingRuleSchema.plugin(auditPlugin);
pricingRuleSchema.plugin(softDeletePlugin);
pricingRuleSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODEL
// ===========================================

export const PricingRule = Model.model<IPricingRule, PricingRuleModel>(
  'PricingRule',
  pricingRuleSchema
);

export default PricingRule;
