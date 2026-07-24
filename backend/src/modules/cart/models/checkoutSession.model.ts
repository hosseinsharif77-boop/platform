/**
 * Checkout Session Model
 * 
 * Mongoose schema for checkout sessions.
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../../../models/plugins/audit';
import { toJSONPlugin } from '../../../models/plugins/toJSON';
import { CheckoutStep, CheckoutStatus } from '../interfaces';

// ===========================================
// INTERFACES
// ===========================================

export interface ICheckoutSession extends AuditDocument {
  userId: any;
  cartId: any;
  priceLockId: any;
  
  currentStep: CheckoutStep;
  status: CheckoutStatus;
  
  // Customer info
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  
  // Shipping
  shippingAddress?: any;
  shippingMethod?: any;
  shippingCost: number;
  
  // Billing
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
}

export interface CheckoutSessionModel extends Model<ICheckoutSession> {
  findByUser(userId: string): Promise<ICheckoutSession | null>;
  findActiveByUser(userId: string): Promise<ICheckoutSession | null>;
}

// ===========================================
// SCHEMA
// ===========================================

const checkoutSessionSchema = new Schema<ICheckoutSession, CheckoutSessionModel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  cartId: {
    type: Schema.Types.ObjectId,
    ref: 'Cart',
    required: true,
  },
  priceLockId: {
    type: Schema.Types.ObjectId,
    ref: 'PriceLock',
    required: true,
  },
  
  // Checkout progress
  currentStep: {
    type: String,
    enum: Object.values(CheckoutStep),
    default: CheckoutStep.INFORMATION,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(CheckoutStatus),
    default: CheckoutStatus.IN_PROGRESS,
    required: true,
  },
  
  // Customer info
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  
  // Shipping
  shippingAddress: {
    type: Schema.Types.Mixed,
  },
  shippingMethod: {
    type: Schema.Types.Mixed,
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: 0,
  },
  
  // Billing
  billingAddress: {
    type: Schema.Types.Mixed,
  },
  sameAsShipping: {
    type: Boolean,
    default: true,
  },
  
  // Totals
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  shipping: {
    type: Number,
    default: 0,
    min: 0,
  },
  tax: {
    type: Number,
    default: 0,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  
  // Metadata
  notes: {
    type: String,
    maxlength: 500,
  },
  currency: {
    type: String,
    default: 'USD',
    maxlength: 3,
  },
}, {
  timestamps: true,
  collection: 'checkout_sessions',
});

// ===========================================
// INDEXES
// ===========================================

checkoutSessionSchema.index({ userId: 1, status: 1 });
checkoutSessionSchema.index({ status: 1, createdAt: 1 });

// TTL - clean old sessions after 7 days
checkoutSessionSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 7 * 24 * 60 * 60 }
);

// ===========================================
// STATIC METHODS
// ===========================================

checkoutSessionSchema.statics.findByUser = function (userId: string) {
  return this.findOne({ userId }).sort({ createdAt: -1 });
};

checkoutSessionSchema.statics.findActiveByUser = function (userId: string) {
  return this.findOne({
    userId,
    status: { $in: [CheckoutStatus.IN_PROGRESS, CheckoutStatus.PENDING] },
  });
};

// ===========================================
// APPLY PLUGINS
// ===========================================

checkoutSessionSchema.plugin(auditPlugin);
checkoutSessionSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODEL
// ===========================================

export const CheckoutSession = Model.model<ICheckoutSession, CheckoutSessionModel>(
  'CheckoutSession',
  checkoutSessionSchema
);

export default CheckoutSession;
