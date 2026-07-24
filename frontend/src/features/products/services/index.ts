/**
 * Product API Service
 * 
 * API calls for product operations.
 */

import apiClient from '@/services/api';
import { API_ENDPOINTS } from '@/constants';
import {
  Product,
  ProductListResponse,
  ProductFilters,
  CreateProductDTO,
  UpdateProductDTO,
  UpdateInventoryDTO,
  ProductStats,
} from '../types';

export const productApi = {
  /**
   * Get products list
   */
  async getProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS.BASE}?${params}`);
    return response.data.data;
  },

  /**
   * Get single product
   */
  async getProduct(id: string): Promise<Product> {
    const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}`);
    return response.data.data;
  },

  /**
   * Create product
   */
  async createProduct(data: CreateProductDTO): Promise<Product> {
    const response = await apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, data);
    return response.data.data;
  },

  /**
   * Update product
   */
  async updateProduct(id: string, data: UpdateProductDTO): Promise<Product> {
    const response = await apiClient.put(API_ENDPOINTS.PRODUCTS.UPDATE(id), data);
    return response.data.data;
  },

  /**
   * Delete product
   */
  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
  },

  /**
   * Publish product
   */
  async publishProduct(id: string): Promise<Product> {
    const response = await apiClient.post(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}/publish`);
    return response.data.data;
  },

  /**
   * Archive product
   */
  async archiveProduct(id: string): Promise<Product> {
    const response = await apiClient.post(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}/archive`);
    return response.data.data;
  },

  /**
   * Duplicate product
   */
  async duplicateProduct(id: string): Promise<Product> {
    const response = await apiClient.post(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}/duplicate`);
    return response.data.data;
  },

  /**
   * Update inventory
   */
  async updateInventory(id: string, data: UpdateInventoryDTO): Promise<Product> {
    const response = await apiClient.put(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}/inventory`, data);
    return response.data.data;
  },

  /**
   * Search products
   */
  async searchProducts(query: string): Promise<Product[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS.BASE}/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  },

  /**
   * Get status counts
   */
  async getStatusCounts(): Promise<Record<string, number>> {
    const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS.BASE}/stats/status`);
    return response.data.data;
  },

  /**
   * Get stock summary
   */
  async getStockSummary(): Promise<{
    totalProducts: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS.BASE}/stats/stock`);
    return response.data.data;
  },

  /**
   * Bulk delete
   */
  async bulkDelete(productIds: string[]): Promise<{ modifiedCount: number }> {
    const response = await apiClient.post(`${API_ENDPOINTS.PRODUCTS.BASE}/bulk/delete`, {
      productIds,
    });
    return response.data.data;
  },

  /**
   * Bulk publish
   */
  async bulkPublish(productIds: string[]): Promise<{ modifiedCount: number }> {
    const response = await apiClient.post(`${API_ENDPOINTS.PRODUCTS.BASE}/bulk/publish`, {
      productIds,
    });
    return response.data.data;
  },

  /**
   * Bulk archive
   */
  async bulkArchive(productIds: string[]): Promise<{ modifiedCount: number }> {
    const response = await apiClient.post(`${API_ENDPOINTS.PRODUCTS.BASE}/bulk/archive`, {
      productIds,
    });
    return response.data.data;
  },
};

export default productApi;
