/**
 * Product Model
 * 
 * Mongoose schema for product management.
 */

import { Schema, Document, Model } from 'mongoose';
import { auditPlugin, AuditDocument } from '../../../models/plugins/audit';
import { softDeletePlugin, SoftDeleteDocument } from '../../../models/plugins/softDelete';
import { toJSONPlugin } from '../../../models/plugins/toJSON';
import {
  ProductStatus,
  ProductVisibility,
  PriceType,
  ProductImage,
  ProductDimensions,
  ProductSEO,
  ProductSpecification,
  ProductStats,
} from '../interfaces';

// ===========================================
// INTERFACES
// ===========================================

export interface IProduct extends AuditDocument, SoftDeleteDocument {
  storeId: any;
  sellerId: any;
  
  name: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  
  categoryId: any;
  brandId?: any;
  tags: string[];
  
  priceType: PriceType;
  basePrice: number;
  livePrice: number;
  currency: string;
  lastPriceUpdate?: Date;
  
  sku: string;
  barcode?: string;
  currentStock: number;
  reservedStock: number;
  minimumStock: number;
  trackInventory: boolean;
  
  weight?: number;
  weightUnit: 'kg' | 'g' | 'lb' | 'oz';
  dimensions?: ProductDimensions;
  
  mainImage?: ProductImage;
  images: ProductImage[];
  
  status: ProductStatus;
  visibility: ProductVisibility;
  
  seo: ProductSEO;
  specifications: ProductSpecification[];
  
  stats: ProductStats;
  metadata: Record<string, any>;
}

export interface ProductModel extends Model<IProduct> {
  findBySlug(slug: string, storeId: string): Promise<IProduct | null>;
  findBySKU(sku: string, storeId: string): Promise<IProduct | null>;
  findByStore(storeId: string, filters?: any): Promise<IProduct[]>;
  searchProducts(query: string, storeId: string): Promise<IProduct[]>;
}

// ===========================================
// SUB-SCHEMAS
// ===========================================

const productImageSchema = new Schema<ProductImage>({
  url: { type: String, required: true },
  alt: { type: String, maxlength: 200 },
  isPrimary: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  width: { type: Number },
  height: { type: Number },
  size: { type: Number },
}, { _id: true });

const productDimensionsSchema = new Schema<ProductDimensions>({
  length: { type: Number, min: 0 },
  width: { type: Number, min: 0 },
  height: { type: Number, min: 0 },
  unit: { type: String, enum: ['cm', 'in', 'mm'], default: 'cm' },
}, { _id: false });

const productSEOSchema = new Schema<ProductSEO>({
  title: { type: String, maxlength: 70 },
  description: { type: String, maxlength: 170 },
  keywords: [{ type: String, maxlength: 50 }],
}, { _id: false });

const productSpecificationSchema = new Schema<ProductSpecification>({
  key: { type: String, required: true, maxlength: 100 },
  value: { type: String, required: true, maxlength: 500 },
}, { _id: false });

const productStatsSchema = new Schema<ProductStats>({
  viewCount: { type: Number, default: 0, min: 0 },
  orderCount: { type: Number, default: 0, min: 0 },
  favoriteCount: { type: Number, default: 0, min: 0 },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
}, { _id: false });

// ===========================================
// PRODUCT SCHEMA
// ===========================================

const productSchema = new Schema<IProduct, ProductModel>({
  // Store relationship (multi-tenant)
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
    index: true,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  // Basic Info
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
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters'],
  },
  fullDescription: {
    type: String,
    maxlength: [10000, 'Full description cannot exceed 10000 characters'],
  },

  // Categorization
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
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
    maxlength: 50,
  }],

  // Pricing
  priceType: {
    type: String,
    enum: Object.values(PriceType),
    default: PriceType.STATIC,
    required: true,
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Price cannot be negative'],
  },
  livePrice: {
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
  lastPriceUpdate: {
    type: Date,
  },

  // Inventory
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    trim: true,
    maxlength: 50,
  },
  barcode: {
    type: String,
    trim: true,
    sparse: true,
    maxlength: 100,
  },
  currentStock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  reservedStock: {
    type: Number,
    default: 0,
    min: [0, 'Reserved stock cannot be negative'],
  },
  minimumStock: {
    type: Number,
    default: 0,
    min: 0,
  },
  trackInventory: {
    type: Boolean,
    default: true,
  },

  // Physical
  weight: {
    type: Number,
    min: 0,
  },
  weightUnit: {
    type: String,
    enum: ['kg', 'g', 'lb', 'oz'],
    default: 'kg',
  },
  dimensions: {
    type: productDimensionsSchema,
  },

  // Media
  mainImage: {
    type: productImageSchema,
  },
  images: [productImageSchema],

  // Status
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

  // SEO
  seo: {
    type: productSEOSchema,
    default: () => ({}),
  },

  // Specifications
  specifications: [productSpecificationSchema],

  // Stats (denormalized)
  stats: {
    type: productStatsSchema,
    default: () => ({}),
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

// Available stock
productSchema.virtual('availableStock').get(function () {
  return this.currentStock - this.reservedStock;
});

// Stock status
productSchema.virtual('stockStatus').get(function () {
  if (!this.trackInventory) return StockStatus.IN_STOCK;
  
  const available = this.currentStock - this.reservedStock;
  
  if (available <= 0) return StockStatus.OUT_OF_STOCK;
  if (available <= this.minimumStock) return StockStatus.LOW_STOCK;
  return StockStatus.IN_STOCK;
});

// Store relationship
productSchema.virtual('store', {
  ref: 'Store',
  localField: 'storeId',
  foreignField: '_id',
  justOne: true,
});

// Seller relationship
productSchema.virtual('seller', {
  ref: 'User',
  localField: 'sellerId',
  foreignField: '_id',
  justOne: true,
});

// Category relationship
productSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true,
});

// Brand relationship
productSchema.virtual('brand', {
  ref: 'Brand',
  localField: 'brandId',
  foreignField: '_id',
  justOne: true,
});

// ===========================================
// INDEXES
// ===========================================

// Unique slug per store
productSchema.index(
  { storeId: 1, slug: 1 },
  { unique: true }
);

// Unique SKU per store
productSchema.index(
  { storeId: 1, sku: 1 },
  { unique: true }
);

// Common query patterns
productSchema.index({ storeId: 1, status: 1 });
productSchema.index({ storeId: 1, categoryId: 1, status: 1 });
productSchema.index({ storeId: 1, brandId: 1, status: 1 });
productSchema.index({ storeId: 1, priceType: 1 });
productSchema.index({ storeId: 1, createdAt: -1 });

// Stock queries
productSchema.index({ storeId: 1, currentStock: 1 });
productSchema.index({ storeId: 1, trackInventory: 1, currentStock: 1 });

// Text search
productSchema.index(
  {
    name: 'text',
    shortDescription: 'text',
    tags: 'text',
    sku: 'text',
  },
  {
    weights: { name: 10, sku: 8, tags: 5, shortDescription: 2 },
    name: 'idx_product_text',
  }
);

// Price queries
productSchema.index({ basePrice: 1 });
productSchema.index({ livePrice: 1 });

// ===========================================
// MIDDLEWARE
// ===========================================

// Auto-generate slug from name
productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Set livePrice to basePrice for static pricing
productSchema.pre('save', function (next) {
  if (this.priceType === PriceType.STATIC && this.isModified('basePrice')) {
    this.livePrice = this.basePrice;
    this.lastPriceUpdate = new Date();
  }
  next();
});

// ===========================================
// STATIC METHODS
// ===========================================

productSchema.statics.findBySlug = function (slug: string, storeId: string) {
  return this.findOne({ slug, storeId, isDeleted: false });
};

productSchema.statics.findBySKU = function (sku: string, storeId: string) {
  return this.findOne({ sku: sku.toUpperCase(), storeId, isDeleted: false });
};

productSchema.statics.findByStore = function (storeId: string, filters: any = {}) {
  return this.find({ ...filters, storeId, isDeleted: false });
};

productSchema.statics.searchProducts = function (query: string, storeId: string) {
  return this.find({
    storeId,
    isDeleted: false,
    status: ProductStatus.PUBLISHED,
    $text: { $search: query },
  }).sort({ score: { $meta: 'textScore' } });
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

export const Product = Model.model<IProduct, ProductModel>(
  'Product',
  productSchema
);

export default Product;
