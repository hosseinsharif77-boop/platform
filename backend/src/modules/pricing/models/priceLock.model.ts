/**
 * Price Lock Model
 * 
 * Temporary price locks for checkout process.
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../../../models/plugins/audit';
import { toJSONPlugin } from '../../../models/plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

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
  metadata: Record<string, any>;
}

export interface PriceLockModel extends Model<IPriceLock> {
  findActiveByProduct(productId: string): Promise<IPriceLock[]>;
  findActiveByUser(userId: string): Promise<IPriceLock[]>;
  findExpired(): Promise<IPriceLock[]>;
  cleanupExpired(): Promise<number>;
}

// ===========================================
// SCHEMA DEFINITION
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

  // User who locked
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  // Locked price
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

  // Flexible metadata
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'price_locks',
});

// ===========================================
// INDEXES
// ===========================================

priceLockSchema.index({ productId: 1, userId: 1, isActive: 1 });
priceLockSchema.index({ userId: 1, isActive: 1 });
priceLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// ===========================================
// STATIC METHODS
// ===========================================

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

priceLockSchema.statics.findExpired = function () {
  return this.find({
    isActive: true,
    expiresAt: { $lte: new Date() },
  });
};

priceLockSchema.statics.cleanupExpired = async function () {
  const result = await this.updateMany(
    {
      isActive: true,
      expiresAt: { $lte: new Date() },
    },
    { isActive: false }
  );
  return result.modifiedCount;
};

// ===========================================
// APPLY PLUGINS
// ===========================================

priceLockSchema.plugin(auditPlugin);
priceLockSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODEL
// ===========================================

export const PriceLock = Model.model<IPriceLock, PriceLockModel>(
  'PriceLock',
  priceLockSchema
);

export default PriceLock;
