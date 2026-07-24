/**
 * Cart Schemas
 * 
 * Shopping cart management schemas including:
 * - Cart: Main cart document
 * - CartItem: Individual cart items
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../plugins/audit';
import { toJSONPlugin } from '../plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export interface ICartItem {
  productId: any;
  variantId?: any;
  name: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  image?: string;
  addedAt: Date;
  metadata?: Record<string, any>;
}

export interface ICart extends AuditDocument {
  userId: any;
  storeId: any;
  items: ICartItem[];
  
  // Pricing
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  
  // Status
  isActive: boolean;
  
  // Metadata
  lastActivityAt: Date;
  expiresAt?: Date;
  metadata: Record<string, any>;
  
  // Virtuals
  user?: any;
  store?: any;
  itemCount: number;
}

export interface CartModel extends Model<ICart> {
  findByUser(userId: string, storeId?: string): Promise<ICart | null>;
  findActiveByUser(userId: string): Promise<ICart[]>;
}

// ===========================================
// CART ITEM SCHEMA
// ===========================================

const cartItemSchema = new Schema<ICartItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  },
  variantId: {
    type: Schema.Types.ObjectId,
  },
  name: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    maxlength: 3,
  },
  image: {
    type: String,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, { _id: true });

// ===========================================
// CART SCHEMA
// ===========================================

const cartSchema = new Schema<ICart, CartModel>({
  // User relationship
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  // Store relationship (carts are per-store)
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
    index: true,
  },

  // Items
  items: [cartItemSchema],

  // Pricing
  subtotal: {
    type: Number,
    default: 0,
    min: 0,
  },
  tax: {
    type: Number,
    default: 0,
    min: 0,
  },
  total: {
    type: Number,
    default: 0,
    min: 0,
  },
  currency: {
    type: String,
    default: 'USD',
    maxlength: 3,
    uppercase: true,
  },

  // Status
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },

  // Activity tracking
  lastActivityAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  expiresAt: {
    type: Date,
    index: true,
  },

  // Flexible metadata
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'carts',
});

// ===========================================
// VIRTUALS
// ===========================================

cartSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

cartSchema.virtual('store', {
  ref: 'Store',
  localField: 'storeId',
  foreignField: '_id',
  justOne: true,
});

cartSchema.virtual('itemCount').get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// ===========================================
// INDEXES
// ===========================================

// Primary query patterns
cartSchema.index({ userId: 1, storeId: 1 });
cartSchema.index({ userId: 1, isActive: 1 });
cartSchema.index({ lastActivityAt: -1 });

// TTL index for cart expiration (30 days inactive)
cartSchema.index(
  { lastActivityAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 }
);

// ===========================================
// STATIC METHODS
// ===========================================

cartSchema.statics.findByUser = function (userId: string, storeId?: string) {
  const filter: any = { userId, isActive: true };
  if (storeId) filter.storeId = storeId;
  return this.findOne(filter);
};

cartSchema.statics.findActiveByUser = function (userId: string) {
  return this.find({ userId, isActive: true });
};

// ===========================================
// APPLY PLUGINS
// ===========================================

cartSchema.plugin(auditPlugin);
cartSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODELS
// ===========================================

export const Cart = Model.model<ICart, CartModel>('Cart', cartSchema);
export default Cart;
