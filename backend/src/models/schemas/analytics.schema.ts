/**
 * Analytics Schemas
 * 
 * Seller and customer analytics schemas.
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../plugins/audit';
import { toJSONPlugin } from '../plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export interface ISellerAnalytics extends Document {
  storeId: any;
  date: Date;
  
  // Sales metrics
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  
  // Product metrics
  productsViewed: number;
  productsAddedToCart: number;
  productsPurchased: number;
  
  // Customer metrics
  newCustomers: number;
  returningCustomers: number;
  
  // Traffic metrics
  pageViews: number;
  uniqueVisitors: number;
  conversionRate: number;
  
  // Top products
  topProducts: {
    productId: any;
    views: number;
    orders: number;
    revenue: number;
  }[];
  
  createdAt: Date;
}

export interface ICustomerAnalytics extends Document {
  userId: any;
  
  // Order metrics
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  
  // Activity metrics
  productsViewed: number;
  productsFavorited: number;
  reviewsWritten: number;
  
  // Store interactions
  storesFollowed: any[];
  storesPurchasedFrom: number;
  
  // Last activity
  lastOrderAt?: Date;
  lastViewAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface SellerAnalyticsModel extends Model<ISellerAnalytics> {
  findByStore(storeId: string, startDate?: Date, endDate?: Date): Promise<ISellerAnalytics[]>;
  getDailyStats(storeId: string, days?: number): Promise<ISellerAnalytics[]>;
}

export interface CustomerAnalyticsModel extends Model<ICustomerAnalytics> {
  findByUser(userId: string): Promise<ICustomerAnalytics | null>;
  incrementOrders(userId: string, amount: number): Promise<void>;
}

// ===========================================
// SELLER ANALYTICS SCHEMA
// ===========================================

const sellerAnalyticsSchema = new Schema<ISellerAnalytics, SellerAnalyticsModel>({
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },

  // Sales metrics
  totalOrders: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalRevenue: {
    type: Number,
    default: 0,
    min: 0,
  },
  averageOrderValue: {
    type: Number,
    default: 0,
    min: 0,
  },

  // Product metrics
  productsViewed: {
    type: Number,
    default: 0,
    min: 0,
  },
  productsAddedToCart: {
    type: Number,
    default: 0,
    min: 0,
  },
  productsPurchased: {
    type: Number,
    default: 0,
    min: 0,
  },

  // Customer metrics
  newCustomers: {
    type: Number,
    default: 0,
    min: 0,
  },
  returningCustomers: {
    type: Number,
    default: 0,
    min: 0,
  },

  // Traffic metrics
  pageViews: {
    type: Number,
    default: 0,
    min: 0,
  },
  uniqueVisitors: {
    type: Number,
    default: 0,
    min: 0,
  },
  conversionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },

  // Top products (denormalized)
  topProducts: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    views: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
  }],
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'seller_analytics',
});

// Indexes
sellerAnalyticsSchema.index({ storeId: 1, date: -1 });
sellerAnalyticsSchema.index({ storeId: 1, date: 1 }, { unique: true });

// Static methods
sellerAnalyticsSchema.statics.findByStore = function (
  storeId: string,
  startDate?: Date,
  endDate?: Date
) {
  const filter: any = { storeId };
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = startDate;
    if (endDate) filter.date.$lte = endDate;
  }
  return this.find(filter).sort({ date: -1 });
};

sellerAnalyticsSchema.statics.getDailyStats = function (storeId: string, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    storeId,
    date: { $gte: startDate },
  }).sort({ date: 1 });
};

// Apply plugins
sellerAnalyticsSchema.plugin(toJSONPlugin);

// ===========================================
// CUSTOMER ANALYTICS SCHEMA
// ===========================================

const customerAnalyticsSchema = new Schema<ICustomerAnalytics, CustomerAnalyticsModel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },

  // Order metrics
  totalOrders: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0,
  },
  averageOrderValue: {
    type: Number,
    default: 0,
    min: 0,
  },

  // Activity metrics
  productsViewed: {
    type: Number,
    default: 0,
    min: 0,
  },
  productsFavorited: {
    type: Number,
    default: 0,
    min: 0,
  },
  reviewsWritten: {
    type: Number,
    default: 0,
    min: 0,
  },

  // Store interactions
  storesFollowed: [{
    type: Schema.Types.ObjectId,
    ref: 'Store',
  }],
  storesPurchasedFrom: {
    type: Number,
    default: 0,
    min: 0,
  },

  // Last activity
  lastOrderAt: {
    type: Date,
    sparse: true,
  },
  lastViewAt: {
    type: Date,
    sparse: true,
  },
}, {
  timestamps: true,
  collection: 'customer_analytics',
});

// Indexes
customerAnalyticsSchema.index({ totalOrders: -1 });
customerAnalyticsSchema.index({ totalSpent: -1 });
customerAnalyticsSchema.index({ lastOrderAt: -1 }, { sparse: true });

// Static methods
customerAnalyticsSchema.statics.findByUser = function (userId: string) {
  return this.findOne({ userId });
};

customerAnalyticsSchema.statics.incrementOrders = async function (userId: string, amount: number) {
  return this.findOneAndUpdate(
    { userId },
    {
      $inc: {
        totalOrders: 1,
        totalSpent: amount,
      },
      $set: { lastOrderAt: new Date() },
    },
    { upsert: true, new: true }
  );
};

// Apply plugins
customerAnalyticsSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODELS
// ===========================================

export const SellerAnalytics = Model.model<ISellerAnalytics, SellerAnalyticsModel>(
  'SellerAnalytics',
  sellerAnalyticsSchema
);

export const CustomerAnalytics = Model.model<ICustomerAnalytics, CustomerAnalyticsModel>(
  'CustomerAnalytics',
  customerAnalyticsSchema
);

export default { SellerAnalytics, CustomerAnalytics };
