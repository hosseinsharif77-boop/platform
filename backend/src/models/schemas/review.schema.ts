/**
 * Review Schema
 * 
 * Product review and rating system.
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../plugins/audit';
import { softDeletePlugin, SoftDeleteDocument } from '../plugins/softDelete';
import { toJSONPlugin } from '../plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface IReview extends AuditDocument, SoftDeleteDocument {
  productId: any;
  storeId: any;
  userId: any;
  orderId?: any;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  status: ReviewStatus;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  reportCount: number;
  sellerReply?: {
    comment: string;
    repliedAt: Date;
    repliedBy: any;
  };
  metadata: Record<string, any>;
  
  // Virtuals
  product?: any;
  store?: any;
  user?: any;
}

export interface ReviewModel extends Model<IReview> {
  findByProduct(productId: string, filter?: any): Promise<IReview[]>;
  findByStore(storeId: string, filter?: any): Promise<IReview[]>;
  findByUser(userId: string): Promise<IReview[]>;
  getProductRating(productId: string): Promise<{ average: number; count: number }>;
}

// ===========================================
// SCHEMA DEFINITION
// ===========================================

const reviewSchema = new Schema<IReview, ReviewModel>({
  // Relationships
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
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    sparse: true,
  },

  // Review content
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    maxlength: [2000, 'Comment cannot exceed 2000 characters'],
  },
  images: [{
    type: String,
  }],

  // Status
  status: {
    type: String,
    enum: Object.values(ReviewStatus),
    default: ReviewStatus.PENDING,
    required: true,
    index: true,
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false,
    index: true,
  },

  // Engagement
  helpfulCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  reportCount: {
    type: Number,
    default: 0,
    min: 0,
  },

  // Seller reply
  sellerReply: {
    comment: String,
    repliedAt: Date,
    repliedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },

  // Flexible metadata
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'reviews',
});

// ===========================================
// VIRTUALS
// ===========================================

reviewSchema.virtual('product', {
  ref: 'Product',
  localField: 'productId',
  foreignField: '_id',
  justOne: true,
});

reviewSchema.virtual('store', {
  ref: 'Store',
  localField: 'storeId',
  foreignField: '_id',
  justOne: true,
});

reviewSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// ===========================================
// INDEXES
// ===========================================

// One review per user per product
reviewSchema.index(
  { productId: 1, userId: 1 },
  { unique: true }
);

// Query patterns
reviewSchema.index({ productId: 1, status: 1, createdAt: -1 });
reviewSchema.index({ storeId: 1, status: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isVerifiedPurchase: 1 });

// ===========================================
// STATIC METHODS
// ===========================================

reviewSchema.statics.findByProduct = function (productId: string, filter: any = {}) {
  return this.find({ ...filter, productId, status: ReviewStatus.APPROVED })
    .sort({ createdAt: -1 })
    .populate('user', 'firstName lastName avatar');
};

reviewSchema.statics.findByStore = function (storeId: string, filter: any = {}) {
  return this.find({ ...filter, storeId, status: ReviewStatus.APPROVED })
    .sort({ createdAt: -1 });
};

reviewSchema.statics.findByUser = function (userId: string) {
  return this.find({ userId, isDeleted: false })
    .sort({ createdAt: -1 })
    .populate('product', 'name slug images');
};

reviewSchema.statics.getProductRating = async function (productId: string) {
  const result = await this.aggregate([
    {
      $match: {
        productId: new Schema.Types.ObjectId(productId),
        status: ReviewStatus.APPROVED,
        isDeleted: { $ne: true },
      },
    },
    {
      $group: {
        _id: null,
        average: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  return result[0] || { average: 0, count: 0 };
};

// ===========================================
// APPLY PLUGINS
// ===========================================

reviewSchema.plugin(auditPlugin);
reviewSchema.plugin(softDeletePlugin);
reviewSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODEL
// ===========================================

export const Review = Model.model<IReview, ReviewModel>('Review', reviewSchema);
export default Review;
