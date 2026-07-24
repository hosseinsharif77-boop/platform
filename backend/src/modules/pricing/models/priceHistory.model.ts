/**
 * Price History Model
 * 
 * Records every price change for audit and rollback.
 */

import { Schema, Document, Model } from 'mongoose';
import { toJSONPlugin } from '../../../models/plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export enum PriceChangeReason {
  EXCHANGE_RATE = 'exchange_rate',
  RULE_APPLICATION = 'rule_application',
  MANUAL_OVERRIDE = 'manual_override',
  SCHEDULED_UPDATE = 'scheduled_update',
  ROLLBACK = 'rollback',
  SYSTEM = 'system',
}

export interface IPriceHistory extends Document {
  productId: any;
  storeId: any;
  variantId?: any;
  
  oldPrice: number;
  newPrice: number;
  currency: string;
  exchangeRate: number;
  
  reason: PriceChangeReason;
  description?: string;
  
  version: number;
  
  changedBy?: any;
  changedByType: 'system' | 'seller' | 'admin';
  
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface PriceHistoryModel extends Model<IPriceHistory> {
  findByProduct(productId: string, limit?: number): Promise<IPriceHistory[]>;
  findByStore(storeId: string, limit?: number): Promise<IPriceHistory[]>;
  getLatestPrice(productId: string): Promise<IPriceHistory | null>;
}

// ===========================================
// SCHEMA DEFINITION
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

  // Price snapshot
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
  exchangeRate: {
    type: Number,
    required: true,
  },

  // Change info
  reason: {
    type: String,
    enum: Object.values(PriceChangeReason),
    required: true,
    index: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },

  // Version
  version: {
    type: Number,
    required: true,
  },

  // Audit
  changedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
  },
  changedByType: {
    type: String,
    enum: ['system', 'seller', 'admin'],
    default: 'system',
  },

  // Flexible metadata
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'price_history',
});

// ===========================================
// INDEXES
// ===========================================

// Primary query patterns
priceHistorySchema.index({ productId: 1, createdAt: -1 });
priceHistorySchema.index({ storeId: 1, createdAt: -1 });
priceHistorySchema.index({ productId: 1, storeId: 1, createdAt: -1 });

// For rollback queries
priceHistorySchema.index({ productId: 1, version: -1 });
priceHistorySchema.index({ productId: 1, storeId: 1, version: -1 });

// For reason filtering
priceHistorySchema.index({ reason: 1, createdAt: -1 });

// TTL - keep history for 2 years
priceHistorySchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 2 * 365 * 24 * 60 * 60 }
);

// ===========================================
// STATIC METHODS
// ===========================================

priceHistorySchema.statics.findByProduct = function (productId: string, limit = 50) {
  return this.find({ productId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('changedBy', 'firstName lastName email');
};

priceHistorySchema.statics.findByStore = function (storeId: string, limit = 100) {
  return this.find({ storeId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

priceHistorySchema.statics.getLatestPrice = function (productId: string) {
  return this.findOne({ productId }).sort({ createdAt: -1 });
};

// ===========================================
// APPLY PLUGINS
// ===========================================

priceHistorySchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODEL
// ===========================================

export const PriceHistory = Model.model<IPriceHistory, PriceHistoryModel>(
  'PriceHistory',
  priceHistorySchema
);

export default PriceHistory;
