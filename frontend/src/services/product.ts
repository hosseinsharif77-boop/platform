/**
 * Product Service
 * 
 * Handles product-related API calls.
 */

import apiClient from './api';
import { API_ENDPOINTS } from '@/constants';
import { Product, PaginatedResponse, PaginationParams } from '@/types';

export const productService = {
  /**
   * Get all products
   */
  async getProducts(params?: PaginationParams): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BASE, { params });
    return response.data.data;
  },

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}`);
    return response.data.data;
  },

  /**
   * Get products by store
   */
  async getProductsByStore(
    storeId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BY_STORE(storeId), { params });
    return response.data.data;
  },

  /**
   * Create product
   */
  async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, data);
    return response.data.data;
  },

  /**
   * Update product
   */
  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const response = await apiClient.put(API_ENDPOINTS.PRODUCTS.UPDATE(id), data);
    return response.data.data;
  },

  /**
   * Delete product
   */
  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
  },
};
