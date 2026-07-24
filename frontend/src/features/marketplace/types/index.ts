/**
 * Marketplace Types
 * 
 * TypeScript types for the marketplace.
 */

// ===========================================
// PRODUCT TYPES
// ===========================================

export interface Product {
  _id: string;
  storeId: string;
  storeName?: string;
  storeSlug?: string;
  storeLogo?: string;
  
  name: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  
  categoryName?: string;
  categorySlug?: string;
  brandName?: string;
  brandSlug?: string;
  tags: string[];
  
  priceType: 'static' | 'dynamic';
  basePrice: number;
  livePrice: number;
  compareAtPrice?: number;
  currency: string;
  formattedPrice?: string;
  lastPriceUpdate?: Date;
  priceAgo?: string;
  
  sku: string;
  currentStock: number;
  availableStock: number;
  trackInventory: boolean;
  inStock: boolean;
  lowStock: boolean;
  
  mainImage?: ProductImage;
  images: ProductImage[];
  
  status: string;
  visibility: string;
  
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

export interface ProductImage {
  _id?: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  sortOrder: number;
}

// ===========================================
// CATEGORY TYPES
// ===========================================

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parentId?: string;
  level: number;
  productCount: number;
  children?: Category[];
}

// ===========================================
// BRAND TYPES
// ===========================================

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  productCount: number;
}

// ===========================================
// STORE TYPES
// ===========================================

export interface Store {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  logo?: string;
  banner?: string;
  
  stats: {
    totalProducts: number;
    totalOrders: number;
    averageRating: number;
    totalReviews: number;
  };
  
  settings: {
    currency: string;
    language: string;
  };
  
  createdAt: Date;
}

// ===========================================
// PRICING TYPES
// ===========================================

export interface PriceInfo {
  currentPrice: number;
  originalPrice?: number;
  discount?: number;
  currency: string;
  formatted: string;
  formattedOriginal?: string;
  isLive: boolean;
  lastUpdated?: Date;
  lastUpdatedAgo?: string;
  isLocked: boolean;
  lockExpiresAt?: Date;
}

// ===========================================
// SEARCH TYPES
// ===========================================

export interface SearchResult {
  products: Product[];
  categories: Category[];
  stores: Store[];
  totalCount: number;
}

export interface SearchSuggestion {
  type: 'product' | 'category' | 'store' | 'brand';
  id: string;
  name: string;
  slug: string;
  image?: string;
  count?: number;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  brand?: string;
  store?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// ===========================================
// PAGINATION TYPES
// ===========================================

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ===========================================
// API RESPONSE TYPES
// ===========================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
}

// ===========================================
// LANDING PAGE TYPES
// ===========================================

export interface LandingPageData {
  featuredProducts: Product[];
  newestProducts: Product[];
  trendingProducts: Product[];
  topStores: Store[];
  popularCategories: Category[];
}

export interface MarketplaceHomeData {
  featuredProducts: Product[];
  newestProducts: Product[];
  trendingProducts: Product[];
  recommendedProducts: Product[];
  popularCategories: Category[];
  topStores: Store[];
  latestPriceUpdates: Product[];
}

// ===========================================
// SEO TYPES
// ===========================================

export interface SEOData {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: string;
}
