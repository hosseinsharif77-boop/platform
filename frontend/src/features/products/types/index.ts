/**
 * Product Types
 * 
 * TypeScript types for the frontend product module.
 */

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
}

export interface ProductImage {
  _id?: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Product {
  _id: string;
  storeId: string;
  sellerId: string;
  
  name: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  
  categoryId: string;
  categoryName?: string;
  brandId?: string;
  brandName?: string;
  tags: string[];
  
  priceType: PriceType;
  basePrice: number;
  livePrice: number;
  currency: string;
  formattedPrice?: string;
  lastPriceUpdate?: Date;
  
  sku: string;
  barcode?: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  minimumStock: number;
  trackInventory: boolean;
  stockStatus: StockStatus;
  
  weight?: number;
  weightUnit: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit: string;
  };
  
  mainImage?: ProductImage;
  images: ProductImage[];
  
  status: ProductStatus;
  visibility: ProductVisibility;
  
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  
  specifications: {
    key: string;
    value: string;
  }[];
  
  stats: {
    viewCount: number;
    orderCount: number;
    favoriteCount: number;
    averageRating: number;
    reviewCount: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  status?: ProductStatus | ProductStatus[];
  visibility?: ProductVisibility;
  categoryId?: string;
  brandId?: string;
  priceType?: PriceType;
  stockStatus?: StockStatus;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateProductDTO {
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
  weightUnit?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  status?: ProductStatus;
  visibility?: ProductVisibility;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  specifications?: {
    key: string;
    value: string;
  }[];
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}

export interface UpdateInventoryDTO {
  currentStock?: number;
  minimumStock?: number;
  reservedStock?: number;
  trackInventory?: boolean;
}

export interface ProductStats {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
}
