/**
 * Cart Model
 * 
 * Mongoose schema for shopping cart.
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../../../models/plugins/audit';
import { toJSONPlugin } from '../../../models/plugins/toJSON';
import { CartStatus, CartItem } from '../interfaces';

// ===========================================
// INTERFACES
// ===========================================

export interface ICart extends AuditDocument {
  userId?: any;
  sessionId?: string;
  
  items: CartItem[];
  
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  
  itemCount: number;
  currency: string;
  status: CartStatus;
  
  lastValidatedAt?: Date;
  hasPriceChanges: boolean;
}

export interface CartModel extends Model<ICart> {
  findByUser(userId: string): Promise<ICart | null>;
  findBySession(sessionId: string): Promise<ICart | null>;
  findOrCreate(userId?: string, sessionId?: string): Promise<ICart>;
}

// ===========================================
// CART ITEM SUB-SCHEMA
// ===========================================

const cartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productSlug: {
    type: String,
  },
  productImage: {
    type: String,
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  storeName: {
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
  currentPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  priceValid: {
    type: Boolean,
    default: true,
  },
  priceChanged: {
    type: Boolean,
    default: false,
  },
  priceDifference: {
    type: Number,
  },
  
  sku: {
    type: String,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  availableQuantity: {
    type: Number,
    default: 0,
  },
  
  addedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: true });

// ===========================================
// CART SCHEMA
// ===========================================

const cartSchema = new Schema<ICart, CartModel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
    index: true,
  },
  sessionId: {
    type: String,
    sparse: true,
    index: true,
  },
  
  items: [cartItemSchema],
  
  // Totals
  subtotal: {
    type: Number,
    default: 0,
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
    default: 0,
    min: 0,
  },
  
  // Metadata
  itemCount: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: 'USD',
    maxlength: 3,
  },
  status: {
    type: String,
    enum: Object.values(CartStatus),
    default: CartStatus.ACTIVE,
    required: true,
  },
  
  // Price validation
  lastValidatedAt: {
    type: Date,
  },
  hasPriceChanges: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  collection: 'carts',
});

// ===========================================
// INDEXES
// ===========================================

// Primary query patterns
cartSchema.index({ userId: 1, status: 1 });
cartSchema.index({ sessionId: 1, status: 1 });
cartSchema.index({ status: 1, updatedAt: 1 });

// TTL - clean abandoned carts after 30 days
cartSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 }
);

// ===========================================
// STATIC METHODS
// ===========================================

cartSchema.statics.findByUser = function (userId: string) {
  return this.findOne({
    userId,
    status: { $in: [CartStatus.ACTIVE, CartStatus.CHECKOUT] },
  });
};

cartSchema.statics.findBySession = function (sessionId: string) {
  return this.findOne({
    sessionId,
    status: { $in: [CartStatus.ACTIVE, CartStatus.CHECKOUT] },
  });
};

cartSchema.statics.findOrCreate = async function (userId?: string, sessionId?: string) {
  let cart;
  
  if (userId) {
    cart = await this.findByUser(userId);
  }
  
  if (!cart && sessionId) {
    cart = await this.findBySession(sessionId);
  }
  
  if (!cart) {
    cart = await this.create({
      userId,
      sessionId,
      status: CartStatus.ACTIVE,
    });
  }
  
  return cart;
};

// ===========================================
// INSTANCE METHODS
// ===========================================

cartSchema.methods.recalculateTotals = function () {
  this.itemCount = this.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  this.subtotal = this.items.reduce((sum: number, item: any) => sum + (item.currentPrice * item.quantity), 0);
  this.total = this.subtotal + this.shipping + this.tax - this.discount;
};

// ===========================================
// MIDDLEWARE
// ===========================================

cartSchema.pre('save', function (next) {
  this.recalculateTotals();
  next();
});

// ===========================================
// APPLY PLUGINS
// ===========================================

cartSchema.plugin(auditPlugin);
cartSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODEL
// ===========================================

export const Cart = Model.model<ICart, CartModel>('Cart', cartSchema);
export default Cart;
