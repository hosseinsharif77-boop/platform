/**
 * Order Schemas
 * 
 * Order management schemas including:
 * - Order: Main order document
 * - OrderItem: Individual order items
 * - Payment: Payment transactions
 * - Shipment: Shipping information
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../plugins/audit';
import { softDeletePlugin, SoftDeleteDocument } from '../plugins/softDelete';
import { toJSONPlugin } from '../plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  WALLET = 'wallet',
  CASH_ON_DELIVERY = 'cash_on_delivery',
  CRYPTO = 'crypto',
}

export enum ShipmentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
  FAILED = 'failed',
}

export interface IOrderItem {
  productId: any;
  variantId?: any;
  name: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
  tax: number;
  currency: string;
  image?: string;
  metadata?: Record<string, any>;
}

export interface IOrderTimeline {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
  updatedBy?: any;
}

export interface IOrder extends AuditDocument, SoftDeleteDocument {
  orderNumber: string;
  storeId: any;
  userId: any;
  status: OrderStatus;
  
  // Items
  items: IOrderItem[];
  
  // Pricing
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  exchangeRate: number;
  
  // Payment
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  paidAt?: Date;
  
  // Shipping
  shippingAddress: any;
  billingAddress?: any;
  
  // Timeline
  timeline: IOrderTimeline[];
  
  // Metadata
  notes?: string;
  customerNotes?: string;
  internalNotes?: string;
  metadata: Record<string, any>;
  
  // Virtuals
  store?: any;
  user?: any;
  payments?: any[];
  shipments?: any[];
}

export interface IOrderItemDoc extends Document {
  orderId: any;
  productId: any;
  variantId?: any;
  storeId: any;
  name: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
  tax: number;
  currency: string;
  image?: string;
  metadata?: Record<string, any>;
}

export interface IPayment extends AuditDocument {
  orderId: any;
  storeId: any;
  userId: any;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  reference?: string;
  gatewayResponse?: Record<string, any>;
  refundedAmount: number;
  refundedAt?: Date;
  metadata: Record<string, any>;
}

export interface IShipment extends AuditDocument {
  orderId: any;
  storeId: any;
  items: any[];
  trackingNumber?: string;
  carrier?: string;
  method?: string;
  status: ShipmentStatus;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  address: any;
  metadata: Record<string, any>;
}

export interface OrderModel extends Model<IOrder> {
  findByOrderNumber(orderNumber: string): Promise<IOrder | null>;
  findByStore(storeId: string, filter?: any): Promise<IOrder[]>;
  findByUser(userId: string, filter?: any): Promise<IOrder[]>;
}

// ===========================================
// ORDER ITEM SCHEMA
// ===========================================

const orderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
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
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  tax: {
    type: Number,
    default: 0,
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
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, { _id: true });

// ===========================================
// ORDER TIMELINE SCHEMA
// ===========================================

const orderTimelineSchema = new Schema<IOrderTimeline>({
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  note: {
    type: String,
    maxlength: 500,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { _id: false });

// ===========================================
// ORDER SCHEMA
// ===========================================

const orderSchema = new Schema<IOrder, OrderModel>({
  // Order identification
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },

  // Relationships
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

  // Status
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
    required: true,
    index: true,
  },

  // Items
  items: [orderItemSchema],

  // Pricing
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  tax: {
    type: Number,
    default: 0,
    min: 0,
  },
  shipping: {
    type: Number,
    default: 0,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    maxlength: 3,
    uppercase: true,
  },
  exchangeRate: {
    type: Number,
    default: 1,
    min: 0,
  },

  // Payment
  paymentStatus: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
    required: true,
    index: true,
  },
  paymentMethod: {
    type: String,
    enum: Object.values(PaymentMethod),
  },
  paymentReference: {
    type: String,
    sparse: true,
  },
  paidAt: {
    type: Date,
    sparse: true,
  },

  // Shipping
  shippingAddress: {
    type: Schema.Types.Mixed,
    required: true,
  },
  billingAddress: {
    type: Schema.Types.Mixed,
  },

  // Timeline
  timeline: [orderTimelineSchema],

  // Notes
  notes: {
    type: String,
    maxlength: 1000,
  },
  customerNotes: {
    type: String,
    maxlength: 1000,
  },
  internalNotes: {
    type: String,
    maxlength: 1000,
  },

  // Flexible metadata
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'orders',
});

// ===========================================
// ORDER INDEXES
// ===========================================

// Primary query patterns
orderSchema.index({ storeId: 1, status: 1 });
orderSchema.index({ storeId: 1, createdAt: -1 });
orderSchema.index({ userId: 1, status: 1 });
orderSchema.index({ userId: 1, createdAt: -1 });

// Payment queries
orderSchema.index({ paymentStatus: 1, status: 1 });
orderSchema.index({ paymentReference: 1 }, { sparse: true });

// Date range queries
orderSchema.index({ createdAt: -1 });
orderSchema.index({ paidAt: 1 }, { sparse: true });

// Common filters
orderSchema.index({ storeId: 1, paymentStatus: 1, status: 1 });
orderSchema.index({ storeId: 1, userId: 1, status: 1 });

// ===========================================
// ORDER STATIC METHODS
// ===========================================

orderSchema.statics.findByOrderNumber = function (orderNumber: string) {
  return this.findOne({ orderNumber, isDeleted: false });
};

orderSchema.statics.findByStore = function (storeId: string, filter: any = {}) {
  return this.find({ ...filter, storeId, isDeleted: false });
};

orderSchema.statics.findByUser = function (userId: string, filter: any = {}) {
  return this.find({ ...filter, userId, isDeleted: false });
};

// ===========================================
// PAYMENT SCHEMA
// ===========================================

const paymentSchema = new Schema<IPayment>({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
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

  // Payment details
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    maxlength: 3,
  },
  method: {
    type: String,
    enum: Object.values(PaymentMethod),
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
    required: true,
    index: true,
  },

  // Gateway info
  reference: {
    type: String,
    sparse: true,
    index: true,
  },
  gatewayResponse: {
    type: Schema.Types.Mixed,
  },

  // Refund tracking
  refundedAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  refundedAt: {
    type: Date,
    sparse: true,
  },

  // Flexible metadata
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'payments',
});

// Payment indexes
paymentSchema.index({ orderId: 1, status: 1 });
paymentSchema.index({ storeId: 1, createdAt: -1 });
paymentSchema.index({ reference: 1 }, { sparse: true });

// Apply plugins
paymentSchema.plugin(auditPlugin);
paymentSchema.plugin(toJSONPlugin);

// ===========================================
// SHIPMENT SCHEMA
// ===========================================

const shipmentSchema = new Schema<IShipment>({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true,
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
    index: true,
  },

  // Items in this shipment
  items: [{
    orderItemId: { type: Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true, min: 1 },
  }],

  // Tracking
  trackingNumber: {
    type: String,
    sparse: true,
    index: true,
  },
  carrier: {
    type: String,
    trim: true,
  },
  method: {
    type: String,
    trim: true,
  },

  // Status
  status: {
    type: String,
    enum: Object.values(ShipmentStatus),
    default: ShipmentStatus.PENDING,
    required: true,
    index: true,
  },

  // Delivery
  estimatedDelivery: {
    type: Date,
  },
  actualDelivery: {
    type: Date,
    sparse: true,
  },

  // Address
  address: {
    type: Schema.Types.Mixed,
    required: true,
  },

  // Flexible metadata
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'shipments',
});

// Shipment indexes
shipmentSchema.index({ orderId: 1, status: 1 });
shipmentSchema.index({ trackingNumber: 1 }, { sparse: true });
shipmentSchema.index({ storeId: 1, status: 1 });

// Apply plugins
shipmentSchema.plugin(auditPlugin);
shipmentSchema.plugin(toJSONPlugin);

// ===========================================
// APPLY PLUGINS TO ORDER
// ===========================================

orderSchema.plugin(auditPlugin);
orderSchema.plugin(softDeletePlugin);
orderSchema.plugin(toJSONPlugin);

// ===========================================
// VIRTUALS
// ===========================================

orderSchema.virtual('store', {
  ref: 'Store',
  localField: 'storeId',
  foreignField: '_id',
  justOne: true,
});

orderSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

orderSchema.virtual('payments', {
  ref: 'Payment',
  localField: '_id',
  foreignField: 'orderId',
});

orderSchema.virtual('shipments', {
  ref: 'Shipment',
  localField: '_id',
  foreignField: 'orderId',
});

// ===========================================
// EXPORT MODELS
// ===========================================

export const Order = Model.model<IOrder, OrderModel>('Order', orderSchema);
export const OrderItem = Model.model<IOrderItemDoc>('OrderItem', orderItemSchema);
export const Payment = Model.model<IPayment>('Payment', paymentSchema);
export const Shipment = Model.model<IShipment>('Shipment', shipmentSchema);

export default { Order, OrderItem, Payment, Shipment };
