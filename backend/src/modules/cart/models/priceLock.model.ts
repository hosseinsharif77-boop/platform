/**
 * Price Lock Model
 * 
 * Mongoose schema for price locking during checkout.
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../../../models/plugins/audit';
import { toJSONPlugin } from '../../../models/plugins/toJSON';
import { PriceLockStatus, PriceLockItem } from '../interfaces';

// ===========================================
// INTERFACES
// ===========================================

export interface IPriceLock extends AuditDocument {
  userId: any;
  sessionId?: string;
  
  items: PriceLockItem[];
  
  lockedAt: Date;
  expiresAt: Date;
  durationMinutes: number;
  
  status: PriceLockStatus;
  
  orderId?: any;
}

export interface PriceLockModel extends Model<IPriceLock> {
  findActiveByUser(userId: string): Promise<IPriceLock | null>;
  findExpired(): Promise<IPriceLock[]>;
  cleanupExpired(): Promise<number>;
}

// ===========================================
// SCHEMA
// ===========================================

const priceLockItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  lockedPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
}, { _id: false });

const priceLockSchema = new Schema<IPriceLock, PriceLockModel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  sessionId: {
    type: String,
    sparse: true,
  },
  
  items: [priceLockItemSchema],
  
  // Timing
  lockedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
  durationMinutes: {
    type: Number,
    default: 15,
  },
  
  // Status
  status: {
    type: String,
    enum: Object.values(PriceLockStatus),
    default: PriceLockStatus.ACTIVE,
    required: true,
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

// ===========================================
// INDEXES
// ===========================================

// Primary query patterns
priceLockSchema.index({ userId: 1, status: 1 });
priceLockSchema.index({ status: 1, expiresAt: 1 });

// TTL index for auto-cleanup
priceLockSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

// ===========================================
// STATIC METHODS
// ===========================================

priceLockSchema.statics.findActiveByUser = function (userId: string) {
  return this.findOne({
    userId,
    status: PriceLockStatus.ACTIVE,
    expiresAt: { $gt: new Date() },
  });
};

priceLockSchema.statics.findExpired = function () {
  return this.find({
    status: PriceLockStatus.ACTIVE,
    expiresAt: { $lte: new Date() },
  });
};

priceLockSchema.statics.cleanupExpired = async function () {
  const result = await this.updateMany(
    {
      status: PriceLockStatus.ACTIVE,
      expiresAt: { $lte: new Date() },
    },
    { status: PriceLockStatus.EXPIRED }
  );
  return result.modifiedCount;
};

// ===========================================
// INSTANCE METHODS
// ===========================================

priceLockSchema.methods.isExpired = function (): boolean {
  return new Date() > this.expiresAt;
};

priceLockSchema.methods.getTimeRemaining = function (): number {
  const remaining = this.expiresAt.getTime() - Date.now();
  return Math.max(0, Math.floor(remaining / 1000));
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
