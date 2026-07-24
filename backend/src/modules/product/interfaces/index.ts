/**
 * Product Interfaces
 * 
 * Core TypeScript interfaces for the product module.
 */

// ===========================================
// PRODUCT TYPES
// ===========================================

export enum ProductStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  PUBLISHED = 'published',
  HIDDEN = 'hidden',
  ARCHIVED = 'archived',
}

export enum ProductVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  HIDDEN = 'hidden',
}

export enum PriceType {
  STATIC = 'static',
  DYNAMIC = 'dynamic',
}

export enum StockStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  BACKORDER = 'backorder',
}

// ===========================================
// PRODUCT IMAGE
// ===========================================

export interface ProductImage {
  _id?: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  sortOrder: number;
  width?: number;
  height?: number;
  size?: number;
  createdAt?: Date;
}

// ===========================================
// PRODUCT DIMENSIONS
// ===========================================

export interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
  unit: 'cm' | 'in' | 'mm';
}

// ===========================================
// PRODUCT SEO
// ===========================================

export interface ProductSEO {
  title?: string;
  description?: string;
  keywords?: string[];
}

// ===========================================
// PRODUCT SPECIFICATIONS
// ===========================================

export interface ProductSpecification {
  key: string;
  value: string;
}

// ===========================================
// PRODUCT STATISTICS
// ===========================================

export interface ProductStats {
  viewCount: number;
  orderCount: number;
  favoriteCount: number;
  averageRating: number;
  reviewCount: number;
}

// ===========================================
// PRODUCT INTERFACE
// ===========================================

export interface IProduct {
  _id: string;
  storeId: string;
  sellerId: string;
  
  // Basic Info
  name: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  
  // Categorization
  categoryId: string;
  brandId?: string;
  tags: string[];
  
  // Pricing
  priceType: PriceType;
  basePrice: number;
  livePrice?: number;
  currency: string;
  lastPriceUpdate?: Date;
  
  // Inventory
  sku: string;
  barcode?: string;
  currentStock: number;
  reservedStock: number;
  minimumStock: number;
  trackInventory: boolean;
  
  // Physical
  weight?: number;
  weightUnit: 'kg' | 'g' | 'lb' | 'oz';
  dimensions?: ProductDimensions;
  
  // Media
  mainImage?: ProductImage;
  images: ProductImage[];
  
  // Status
  status: ProductStatus;
  visibility: ProductVisibility;
  
  // SEO
  seo: ProductSEO;
  
  // Specifications
  specifications: ProductSpecification[];
  
  // Stats (denormalized)
  stats: ProductStats;
  
  // Metadata
  metadata: Record<string, any>;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ===========================================
// PRODUCT FILTERS
// ===========================================

export interface ProductFilters {
  status?: ProductStatus | ProductStatus[];
  visibility?: ProductVisibility;
  categoryId?: string;
  brandId?: string;
  priceType?: PriceType;
  stockStatus?: StockStatus;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// ===========================================
// PRODUCT LIST RESPONSE
// ===========================================

export interface ProductListResponse {
  products: IProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: ProductFilters;
}

// ===========================================
// CREATE PRODUCT DTO
// ===========================================

export interface CreateProductDTO {
  storeId: string;
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  categoryId: string;
  brandId?: string;
  tags?: string[];
  priceType: PriceType;
  basePrice: number;
  currency?: string;
  sku: string;
  barcode?: string;
  currentStock?: number;
  minimumStock?: number;
  trackInventory?: boolean;
  weight?: number;
  weightUnit?: 'kg' | 'g' | 'lb' | 'oz';
  dimensions?: ProductDimensions;
  status?: ProductStatus;
  visibility?: ProductVisibility;
  seo?: ProductSEO;
  specifications?: ProductSpecification[];
  metadata?: Record<string, any>;
}

// ===========================================
// UPDATE PRODUCT DTO
// ===========================================

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  name?: string;
  slug?: string;
}

// ===========================================
// UPDATE INVENTORY DTO
// ===========================================

export interface UpdateInventoryDTO {
  currentStock?: number;
  minimumStock?: number;
  reservedStock?: number;
  trackInventory?: boolean;
}

// ===========================================
// BULK OPERATIONS
// ===========================================

export interface BulkOperationDTO {
  productIds: string[];
  storeId: string;
}

export interface BulkDeleteDTO extends BulkOperationDTO {}
export interface BulkPublishDTO extends BulkOperationDTO {}
export interface BulkArchiveDTO extends BulkOperationDTO {}
