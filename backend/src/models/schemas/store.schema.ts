/**
 * Store Schema
 * 
 * Represents a vendor store in the marketplace.
 * Each store has its own settings, products, and members.
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../plugins/audit';
import { softDeletePlugin, SoftDeleteDocument } from '../plugins/softDelete';
import { toJSONPlugin } from '../plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export enum StoreStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_APPROVAL = 'pending_approval',
  REJECTED = 'rejected',
}

export enum StorePlan {
  FREE = 'free',
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export interface IStoreSettings {
  currency: string;
  timezone: string;
  language: string;
  taxRate: number;
  shippingEnabled: boolean;
  minimumOrderAmount: number;
  freeShippingThreshold?: number;
  businessHours: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];
  contactInfo: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

export interface IStore extends AuditDocument, SoftDeleteDocument {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  logo?: string;
  banner?: string;
  ownerId: any;
  status: StoreStatus;
  plan: StorePlan;
  settings: IStoreSettings;
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    averageRating: number;
    totalReviews: number;
  };
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  metadata: Record<string, any>;
  
  // Virtuals
  owner?: any;
  members?: any[];
  products?: any[];
}

export interface StoreModel extends Model<IStore> {
  findBySlug(slug: string): Promise<IStore | null>;
  findActiveStores(filter?: any): Promise<IStore[]>;
  findByOwner(ownerId: string): Promise<IStore | null>;
}

// ===========================================
// SCHEMA DEFINITION
// ===========================================

const storeSettingsSchema = new Schema<IStoreSettings>({
  currency: {
    type: String,
    default: 'USD',
    maxlength: 3,
    uppercase: true,
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'fa', 'ar'],
  },
  taxRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  shippingEnabled: {
    type: Boolean,
    default: true,
  },
  minimumOrderAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  freeShippingThreshold: {
    type: Number,
    min: 0,
  },
  businessHours: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    },
    open: String,
    close: String,
    isClosed: {
      type: Boolean,
      default: false,
    },
  }],
  contactInfo: {
    email: String,
    phone: String,
    address: String,
  },
}, { _id: false });

const storeSchema = new Schema<IStore, StoreModel>({
  // Basic Info
  name: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true,
    maxlength: [100, 'Store name cannot exceed 100 characters'],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters'],
  },
  
  // Media
  logo: String,
  banner: String,

  // Owner & Status
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: Object.values(StoreStatus),
    default: StoreStatus.PENDING_APPROVAL,
    required: true,
    index: true,
  },
  plan: {
    type: String,
    enum: Object.values(StorePlan),
    default: StorePlan.FREE,
    required: true,
  },

  // Settings (embedded document)
  settings: {
    type: storeSettingsSchema,
    default: () => ({}),
  },

  // Denormalized stats (updated via aggregation jobs)
  stats: {
    totalProducts: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },

  // SEO
  seo: {
    title: { type: String, maxlength: 60 },
    description: { type: String, maxlength: 160 },
    keywords: [{ type: String }],
  },

  // Flexible metadata
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'stores',
});

// ===========================================
// VIRTUALS
// ===========================================

storeSchema.virtual('owner', {
  ref: 'User',
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true,
});

storeSchema.virtual('members', {
  ref: 'StoreMember',
  localField: '_id',
  foreignField: 'storeId',
});

storeSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'storeId',
});

// ===========================================
// INDEXES
// ===========================================

// Primary query patterns
storeSchema.index({ slug: 1 });
storeSchema.index({ ownerId: 1 });
storeSchema.index({ status: 1 });
storeSchema.index({ plan: 1, status: 1 });

// Text search
storeSchema.index(
  { name: 'text', description: 'text' },
  { weights: { name: 10, description: 5 } }
);

// Sorting and filtering
storeSchema.index({ createdAt: -1 });
storeSchema.index({ 'stats.averageRating': -1 });
storeSchema.index({ 'stats.totalOrders': -1 });

// ===========================================
// STATIC METHODS
// ===========================================

storeSchema.statics.findBySlug = function (slug: string) {
  return this.findOne({ slug, isDeleted: false });
};

storeSchema.statics.findActiveStores = function (filter: any = {}) {
  return this.find({ ...filter, status: StoreStatus.ACTIVE, isDeleted: false });
};

storeSchema.statics.findByOwner = function (ownerId: string) {
  return this.findOne({ ownerId, isDeleted: false });
};

// ===========================================
// APPLY PLUGINS
// ===========================================

storeSchema.plugin(auditPlugin);
storeSchema.plugin(softDeletePlugin);
storeSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODEL
// ===========================================

export const Store = Model.model<IStore, StoreModel>('Store', storeSchema);
export default Store;
