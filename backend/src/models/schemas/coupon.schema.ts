/**
 * Coupon & Discount Schemas
 * 
 * Promotional discount management.
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../plugins/audit';
import { softDeletePlugin, SoftDeleteDocument } from '../plugins/softDelete';
import { toJSONPlugin } from '../plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
  FREE_SHIPPING = 'free_shipping',
  BUY_X_GET_Y = 'buy_x_get_y',
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
  TIERED = 'tiered',
}

export interface ICoupon extends AuditDocument, SoftDeleteDocument {
  storeId: any;
  code: string;
  description?: string;
  type: CouponType;
  value: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  perUserLimit?: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  applicableProducts?: any[];
  excludedProducts?: any[];
  applicableCategories?: any[];
  metadata: Record<string, any>;
}

export interface IDiscount extends AuditDocument, SoftDeleteDocument {
  storeId: any;
  name: string;
  description?: string;
  type: DiscountType;
  value: number;
  tiers?: {
    minQuantity: number;
    value: number;
  }[];
  minimumQuantity?: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  applicableProducts: any[];
  metadata: Record<string, any>;
}

export interface CouponModel extends Model<ICoupon> {
  findByCode(code: string, storeId?: string): Promise<ICoupon | null>;
  findValidCoupons(storeId: string): Promise<ICoupon[]>;
}

// ===========================================
// COUPON SCHEMA
// ===========================================

const couponSchema = new Schema<ICoupon, CouponModel>({
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
    index: true,
  },
  code: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },

  // Discount configuration
  type: {
    type: String,
    enum: Object.values(CouponType),
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  minimumOrderAmount: {
    type: Number,
    min: 0,
  },
  maximumDiscountAmount: {
    type: Number,
    min: 0,
  },

  // Usage limits
  usageLimit: {
    type: Number,
    min: 0,
  },
  usageCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  perUserLimit: {
    type: Number,
    min: 0,
  },

  // Scheduling
  startDate: {
    type: Date,
    required: true,
    index: true,
  },
  endDate: {
    type: Date,
    required: true,
    index: true,
  },

  // Status
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },

  // Applicability
  applicableProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
  excludedProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
  applicableCategories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
  }],

  // Flexible metadata
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'coupons',
});

// Indexes
couponSchema.index({ storeId: 1, code: 1 }, { unique: true });
couponSchema.index({ storeId: 1, isActive: 1, startDate: 1, endDate: 1 });

// Static methods
couponSchema.statics.findByCode = function (code: string, storeId?: string) {
  const filter: any = { code: code.toUpperCase(), isDeleted: false };
  if (storeId) filter.storeId = storeId;
  return this.findOne(filter);
};

couponSchema.statics.findValidCoupons = function (storeId: string) {
  const now = new Date();
  return this.find({
    storeId,
    isActive: true,
    isDeleted: false,
    startDate: { $lte: now },
    endDate: { $gte: now },
    $or: [
      { usageLimit: { $exists: false } },
      { usageLimit: null },
      { $expr: { $lt: ['$usageCount', '$usageLimit'] } },
    ],
  });
};

// Apply plugins
couponSchema.plugin(auditPlugin);
couponSchema.plugin(softDeletePlugin);
couponSchema.plugin(toJSONPlugin);

// ===========================================
// DISCOUNT SCHEMA
// ===========================================

const discountSchema = new Schema<IDiscount>({
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
    index: true,
  },
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

  // Discount configuration
  type: {
    type: String,
    enum: Object.values(DiscountType),
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  tiers: [{
    minQuantity: { type: Number, required: true },
    value: { type: Number, required: true },
  }],
  minimumQuantity: {
    type: Number,
    min: 1,
  },

  // Scheduling
  startDate: {
    type: Date,
    required: true,
    index: true,
  },
  endDate: {
    type: Date,
    required: true,
    index: true,
  },

  // Status
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },

  // Applicability
  applicableProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],

  // Flexible metadata
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'discounts',
});

// Indexes
discountSchema.index({ storeId: 1, isActive: 1, startDate: 1, endDate: 1 });
discountSchema.index({ applicableProducts: 1 });

// Apply plugins
discountSchema.plugin(auditPlugin);
discountSchema.plugin(softDeletePlugin);
discountSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODELS
// ===========================================

export const Coupon = Model.model<ICoupon, CouponModel>('Coupon', couponSchema);
export const Discount = Model.model<IDiscount>('Discount', discountSchema);

export default { Coupon, Discount };
