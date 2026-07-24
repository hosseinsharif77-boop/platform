/**
 * Product Schema
 * 
 * Core product model for the marketplace.
 * Supports variants, images, pricing rules, and live pricing.
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../plugins/audit';
import { softDeletePlugin, SoftDeleteDocument } from '../plugins/softDelete';
import { toJSONPlugin } from '../plugins/toJSON';

// ===========================================
// TYPES & INTERFACES
// ===========================================

export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
  OUT_OF_STOCK = 'out_of_stock',
}

export enum ProductVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  UNLISTED = 'unlisted',
}

export interface IProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface IProductVariant {
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  inventory: number;
  attributes: Record<string, string>;
  isDefault: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface IProductSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  slug: string;
}

export interface IProduct extends AuditDocument, SoftDeleteDocument {
  storeId: any;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  barcode?: string;
  
  // Relationships
  categoryId: any;
  brandId?: any;
  tags: string[];
  
  // Pricing
  basePrice: number;
  compareAtPrice?: number;
  costPrice?: number;
  currency: string;
  
  // Live pricing
  livePrice: number;
  lastPriceUpdate?: Date;
  priceVersion: number;
  
  // Variants & Images
  variants: IProductVariant[];
  images: IProductImage[];
  
  // Inventory
  inventory: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  
  // Status & Visibility
  status: ProductStatus;
  visibility: ProductVisibility;
  
  // Physical properties
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  
  // Specifications (dynamic attributes)
  specifications: Record<string, string>;
  
  // SEO
  seo: IProductSEO;
  
  // Stats (denormalized)
  stats: {
    viewCount: number;
    orderCount: number;
    favoriteCount: number;
    averageRating: number;
    reviewCount: number;
  };
  
  // Flexible metadata
  metadata: Record<string, any>;
  
  // Virtuals
  store?: any;
  category?: any;
  brand?: any;
  pricingRules?: any[];
  priceHistory?: any[];
}

export interface ProductModel extends Model<IProduct> {
  findBySlug(slug: string, storeId?: string): Promise<IProduct | null>;
  findByStore(storeId: string, filter?: any): Promise<IProduct[]>;
  findBySku(sku: string, storeId?: string): Promise<IProduct | null>;
  searchProducts(query: string, storeId?: string): Promise<IProduct[]>;
}

// ===========================================
// SCHEMA DEFINITION
// ===========================================

const productImageSchema = new Schema<IProductImage>({
  url: { type: String, required: true },
  alt: { type: String },
  isPrimary: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
}, { _id: false });

const productVariantSchema = new Schema<IProductVariant>({
  name: { type: String, required: true },
  sku: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, min: 0 },
  costPrice: { type: Number, min: 0 },
  inventory: { type: Number, default: 0, min: 0 },
  attributes: { type: Schema.Types.Mixed, default: {} },
  isDefault: { type: Boolean, default: false },
  weight: { type: Number, min: 0 },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
  },
}, { _id: true });

const productSEOSchema = new Schema<IProductSEO>({
  title: { type: String, maxlength: 60 },
  description: { type: String, maxlength: 160 },
  keywords: [{ type: String }],
  slug: { type: String, required: true, lowercase: true, trim: true },
}, { _id: false });

const productSchema = new Schema<IProduct, ProductModel>({
  // Store relationship (multi-tenant)
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
    index: true,
  },

  // Basic info
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters'],
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    maxlength: [10000, 'Description cannot exceed 10000 characters'],
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters'],
  },
  sku: {
    type: String,
    trim: true,
    sparse: true,
  },
  barcode: {
    type: String,
    trim: true,
    sparse: true,
  },

  // Relationships
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true,
  },
  brandId: {
    type: Schema.Types.ObjectId,
    ref: 'Brand',
    sparse: true,
    index: true,
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],

  // Pricing
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Price cannot be negative'],
  },
  compareAtPrice: {
    type: Number,
    min: [0, 'Compare at price cannot be negative'],
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative'],
  },
  currency: {
    type: String,
    default: 'USD',
    maxlength: 3,
    uppercase: true,
  },

  // Live pricing
  livePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  lastPriceUpdate: {
    type: Date,
    index: true,
  },
  priceVersion: {
    type: Number,
    default: 1,
  },

  // Variants
  variants: [productVariantSchema],

  // Images
  images: [productImageSchema],

  // Inventory
  inventory: {
    type: Number,
    default: 0,
    min: 0,
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: 0,
  },
  trackInventory: {
    type: Boolean,
    default: true,
  },

  // Status & Visibility
  status: {
    type: String,
    enum: Object.values(ProductStatus),
    default: ProductStatus.DRAFT,
    required: true,
    index: true,
  },
  visibility: {
    type: String,
    enum: Object.values(ProductVisibility),
    default: ProductVisibility.PUBLIC,
    required: true,
  },

  // Physical properties
  weight: {
    type: Number,
    min: 0,
  },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
  },

  // Dynamic specifications
  specifications: {
    type: Schema.Types.Mixed,
    default: {},
  },

  // SEO
  seo: {
    type: productSEOSchema,
    default: () => ({}),
  },

  // Denormalized stats
  stats: {
    viewCount: { type: Number, default: 0 },
    orderCount: { type: Number, default: 0 },
    favoriteCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },

  // Flexible metadata
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'products',
});

// ===========================================
// VIRTUALS
// ===========================================

productSchema.virtual('store', {
  ref: 'Store',
  localField: 'storeId',
  foreignField: '_id',
  justOne: true,
});

productSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true,
});

productSchema.virtual('brand', {
  ref: 'Brand',
  localField: 'brandId',
  foreignField: '_id',
  justOne: true,
});

productSchema.virtual('pricingRules', {
  ref: 'PricingRule',
  localField: '_id',
  foreignField: 'productId',
});

productSchema.virtual('priceHistory', {
  ref: 'PriceHistory',
  localField: '_id',
  foreignField: 'productId',
});

// ===========================================
// INDEXES
// ===========================================

// Unique slug per store
productSchema.index(
  { storeId: 1, 'seo.slug': 1 },
  { unique: true }
);

// Common query patterns
productSchema.index({ storeId: 1, status: 1 });
productSchema.index({ storeId: 1, categoryId: 1, status: 1 });
productSchema.index({ storeId: 1, brandId: 1, status: 1 });
productSchema.index({ storeId: 1, basePrice: 1 });
productSchema.index({ storeId: 1, createdAt: -1 });

// SKU lookup
productSchema.index({ storeId: 1, sku: 1 }, { sparse: true });

// Inventory management
productSchema.index({ inventory: 1, trackInventory: 1 });

// Text search
productSchema.index(
  {
    name: 'text',
    description: 'text',
    tags: 'text',
  },
  {
    weights: { name: 10, tags: 5, description: 1 },
    name: 'idx_product_text',
  }
);

// Price range queries
productSchema.index({ basePrice: 1 });
productSchema.index({ livePrice: 1 });

// ===========================================
// STATIC METHODS
// ===========================================

productSchema.statics.findBySlug = function (slug: string, storeId?: string) {
  const filter: any = { 'seo.slug': slug, isDeleted: false };
  if (storeId) filter.storeId = storeId;
  return this.findOne(filter);
};

productSchema.statics.findByStore = function (storeId: string, filter: any = {}) {
  return this.find({ ...filter, storeId, isDeleted: false });
};

productSchema.statics.findBySku = function (sku: string, storeId?: string) {
  const filter: any = { sku, isDeleted: false };
  if (storeId) filter.storeId = storeId;
  return this.findOne(filter);
};

productSchema.statics.searchProducts = function (query: string, storeId?: string) {
  const filter: any = {
    $text: { $search: query },
    status: ProductStatus.ACTIVE,
    visibility: ProductVisibility.PUBLIC,
    isDeleted: false,
  };
  if (storeId) filter.storeId = storeId;
  return this.find(filter).sort({ score: { $meta: 'textScore' } });
};

// ===========================================
// APPLY PLUGINS
// ===========================================

productSchema.plugin(auditPlugin);
productSchema.plugin(softDeletePlugin);
productSchema.plugin(toJSONPlugin);

// ===========================================
// EXPORT MODEL
// ===========================================

export const Product = Model.model<IProduct, ProductModel>('Product', productSchema);
export default Product;
