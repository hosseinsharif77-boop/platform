/**
 * Favorite Schema
 * 
 * User favorites/wishlist management.
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../plugins/audit';
import { toJSONPlugin } from '../plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export interface IFavorite extends Document {
  userId: any;
  productId: any;
  storeId: any;
  createdAt: Date;
}

export interface FavoriteModel extends Model<IFavorite> {
  toggle(userId: string, productId: string): Promise<boolean>;
  isFavorited(userId: string, productId: string): Promise<boolean>;
  getUserFavorites(userId: string): Promise<IFavorite[]>;
}

// ===========================================
// SCHEMA DEFINITION
// ===========================================

const favoriteSchema = new Schema<IFavorite, FavoriteModel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
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
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'favorites',
});

// ===========================================
// INDEXES
// ===========================================

// One favorite per user per product
favoriteSchema.index(
  { userId: 1, productId: 1 },
  { unique: true }
);

// Query patterns
favoriteSchema.index({ userId: 1, createdAt: -1 });
favoriteSchema.index({ productId: 1 });
favoriteSchema.index({ storeId: 1 });

// ===========================================
// STATIC METHODS
// ===========================================

favoriteSchema.statics.toggle = async function (userId: string, productId: string) {
  const existing = await this.findOne({ userId, productId });
  
  if (existing) {
    await this.deleteOne({ _id: existing._id });
    return false; // Removed
  } else {
    const product = await mongoose.model('Product').findById(productId);
    if (!product) throw new Error('Product not found');
    
    await this.create({
      userId,
      productId,
      storeId: product.storeId,
    });
    return true; // Added
  }
};

favoriteSchema.statics.isFavorited = async function (userId: string, productId: string) {
  const favorite = await this.findOne({ userId, productId });
  return !!favorite;
};

favoriteSchema.statics.getUserFavorites = function (userId: string) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .populate('product', 'name slug images basePrice livePrice storeId');
};

// ===========================================
// APPLY PLUGINS
// ===========================================

favoriteSchema.plugin(auditPlugin);
favoriteSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODEL
// ===========================================

export const Favorite = Model.model<IFavorite, FavoriteModel>('Favorite', favoriteSchema);
export default Favorite;

// Import mongoose for static method
import mongoose from 'mongoose';
