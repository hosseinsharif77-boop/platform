/**
 * Marketplace API Services
 * 
 * API calls for marketplace operations.
 */

import apiClient from '@/services/api';
import { API_ENDPOINTS } from '@/constants';
import {
  Product,
  Category,
  Brand,
  Store,
  SearchResult,
  SearchSuggestion,
  SearchFilters,
  MarketplaceHomeData,
} from '../types';

// ===========================================
// PRODUCT SERVICES
// ===========================================

export const productApi = {
  /**
   * Get product by ID
   */
  async getProduct(id: string): Promise<Product> {
    const response = await apiClient.get(`/products/${id}`);
    return response.data.data;
  },

  /**
   * Get product by slug
   */
  async getProductBySlug(slug: string): Promise<Product> {
    const response = await apiClient.get(`/products/slug/${slug}`);
    return response.data.data;
  },

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const response = await apiClient.get('/products/featured', {
      params: { limit },
    });
    return response.data.data;
  },

  /**
   * Get newest products
   */
  async getNewestProducts(limit = 8): Promise<Product[]> {
    const response = await apiClient.get('/products/newest', {
      params: { limit },
    });
    return response.data.data;
  },

  /**
   * Get trending products
   */
  async getTrendingProducts(limit = 8): Promise<Product[]> {
    const response = await apiClient.get('/products/trending', {
      params: { limit },
    });
    return response.data.data;
  },

  /**
   * Get related products
   */
  async getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
    const response = await apiClient.get(`/products/${productId}/related`, {
      params: { limit },
    });
    return response.data.data;
  },

  /**
   * Get latest price updates
   */
  async getLatestPriceUpdates(limit = 10): Promise<Product[]> {
    const response = await apiClient.get('/products/price-updates', {
      params: { limit },
    });
    return response.data.data;
  },
};

// ===========================================
// CATEGORY SERVICES
// ===========================================

export const categoryApi = {
  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get('/categories');
    return response.data.data;
  },

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await apiClient.get(`/categories/slug/${slug}`);
    return response.data.data;
  },

  /**
   * Get category products
   */
  async getCategoryProducts(
    categorySlug: string,
    filters: SearchFilters = {}
  ): Promise<{ products: Product[]; category: Category; total: number }> {
    const response = await apiClient.get(`/categories/${categorySlug}/products`, {
      params: filters,
    });
    return response.data.data;
  },

  /**
   * Get popular categories
   */
  async getPopularCategories(limit = 8): Promise<Category[]> {
    const response = await apiClient.get('/categories/popular', {
      params: { limit },
    });
    return response.data.data;
  },
};

// ===========================================
// BRAND SERVICES
// ===========================================

export const brandApi = {
  /**
   * Get all brands
   */
  async getBrands(): Promise<Brand[]> {
    const response = await apiClient.get('/brands');
    return response.data.data;
  },

  /**
   * Get brand by slug
   */
  async getBrandBySlug(slug: string): Promise<Brand> {
    const response = await apiClient.get(`/brands/slug/${slug}`);
    return response.data.data;
  },

  /**
   * Get brand products
   */
  async getBrandProducts(
    brandSlug: string,
    filters: SearchFilters = {}
  ): Promise<{ products: Product[]; brand: Brand; total: number }> {
    const response = await apiClient.get(`/brands/${brandSlug}/products`, {
      params: filters,
    });
    return response.data.data;
  },
};

// ===========================================
// STORE SERVICES
// ===========================================

export const storeApi = {
  /**
   * Get store by slug
   */
  async getStoreBySlug(slug: string): Promise<Store> {
    const response = await apiClient.get(`/stores/slug/${slug}`);
    return response.data.data;
  },

  /**
   * Get store products
   */
  async getStoreProducts(
    storeSlug: string,
    filters: SearchFilters = {}
  ): Promise<{ products: Product[]; store: Store; total: number }> {
    const response = await apiClient.get(`/stores/${storeSlug}/products`, {
      params: filters,
    });
    return response.data.data;
  },

  /**
   * Get top stores
   */
  async getTopStores(limit = 8): Promise<Store[]> {
    const response = await apiClient.get('/stores/top', {
      params: { limit },
    });
    return response.data.data;
  },
};

// ===========================================
// SEARCH SERVICES
// ===========================================

export const searchApi = {
  /**
   * Search products
   */
  async search(filters: SearchFilters): Promise<SearchResult> {
    const response = await apiClient.get('/search', { params: filters });
    return response.data.data;
  },

  /**
   * Get search suggestions
   */
  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    const response = await apiClient.get('/search/suggestions', {
      params: { q: query },
    });
    return response.data.data;
  },

  /**
   * Get popular searches
   */
  async getPopularSearches(): Promise<string[]> {
    const response = await apiClient.get('/search/popular');
    return response.data.data;
  },
};

// ===========================================
// MARKETPLACE HOME SERVICES
// ===========================================

export const marketplaceApi = {
  /**
   * Get marketplace home data
   */
  async getHomeData(): Promise<MarketplaceHomeData> {
    const response = await apiClient.get('/marketplace/home');
    return response.data.data;
  },
};

export default {
  products: productApi,
  categories: categoryApi,
  brands: brandApi,
  stores: storeApi,
  search: searchApi,
  marketplace: marketplaceApi,
};
