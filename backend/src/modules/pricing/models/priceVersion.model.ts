/**
 * Price Version Model
 * 
 * Tracks price versions for rollback support.
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../../../models/plugins/audit';
import { toJSONPlugin } from '../../../models/plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export interface IPriceVersion extends AuditDocument {
  productId: any;
  storeId: any;
  
  version: number;
  price: number;
  currency: string;
  
  basePrice: number;
  exchangeRate: number;
  appliedRules: string[];
  
  previousVersion?: number;
  canRollback: boolean;
  
  isActive: boolean;
  metadata: Record<string, any>;
}

export interface PriceVersionModel extends Model<IPriceVersion> {
  getLatestVersion(productId: string): Promise<IPriceVersion | null>;
  getVersion(productId: string, version: number): Promise<IPriceVersion | null>;
  getAllVersions(productId: string): Promise<IPriceVersion[]>;
  getNextVersion(productId: string): Promise<number>;
}

// ===========================================
// SCHEMA DEFINITION
// ===========================================

const priceVersionSchema = new Schema<IPriceVersion, PriceVersionModel>({
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

  // Version info
  version: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    maxlength: 3,
  },

  // Snapshot
  basePrice: {
    type: Number,
    required: true,
  },
  exchangeRate: {
    type: Number,
    required: true,
  },
  appliedRules: [{
    type: String,
  }],

  // Rollback support
  previousVersion: {
    type: Number,
  },
  canRollback: {
    type: Boolean,
    default: true,
  },

  // Active version flag
  isActive: {
    type: Boolean,
    default: false,
    index: true,
  },

  // Flexible metadata
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'price_versions',
});

// ===========================================
// INDEXES
// ===========================================

// Primary query patterns
priceVersionSchema.index({ productId: 1, version: -1 });
priceVersionSchema.index({ productId: 1, isActive: 1 });
priceVersionSchema.index({ storeId: 1, createdAt: -1 });

// Unique version per product
priceVersionSchema.index(
  { productId: 1, version: 1 },
  { unique: true }
);

// ===========================================
// STATIC METHODS
// ===========================================

priceVersionSchema.statics.getLatestVersion = function (productId: string) {
  return this.findOne({ productId, isActive: true });
};

priceVersionSchema.statics.getVersion = function (productId: string, version: number) {
  return this.findOne({ productId, version });
};

priceVersionSchema.statics.getAllVersions = function (productId: string) {
  return this.find({ productId }).sort({ version: -1 });
};

priceVersionSchema.statics.getNextVersion = async function (productId: string) {
  const latest = await this.findOne({ productId }).sort({ version: -1 });
  return latest ? latest.version + 1 : 1;
};

// ===========================================
// APPLY PLUGINS
// ===========================================

priceVersionSchema.plugin(auditPlugin);
priceVersionSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODEL
// ===========================================

export const PriceVersion = Model.model<IPriceVersion, PriceVersionModel>(
  'PriceVersion',
  priceVersionSchema
);

export default PriceVersion;
