/**
 * Store Service
 * 
 * Handles store-related API calls.
 */

import apiClient from './api';
import { API_ENDPOINTS } from '@/constants';
import { Store, PaginatedResponse, PaginationParams } from '@/types';

export const storeService = {
  /**
   * Get all stores
   */
  async getStores(params?: PaginationParams): Promise<PaginatedResponse<Store>> {
    const response = await apiClient.get(API_ENDPOINTS.STORES.BASE, { params });
    return response.data.data;
  },

  /**
   * Get store by ID
   */
  async getStoreById(id: string): Promise<Store> {
    const response = await apiClient.get(`${API_ENDPOINTS.STORES.BASE}/${id}`);
    return response.data.data;
  },

  /**
   * Get my store
   */
  async getMyStore(): Promise<Store> {
    const response = await apiClient.get(API_ENDPOINTS.STORES.MY_STORE);
    return response.data.data;
  },

  /**
   * Create store
   */
  async createStore(data: Partial<Store>): Promise<Store> {
    const response = await apiClient.post(API_ENDPOINTS.STORES.CREATE, data);
    return response.data.data;
  },

  /**
   * Update store
   */
  async updateStore(id: string, data: Partial<Store>): Promise<Store> {
    const response = await apiClient.put(API_ENDPOINTS.STORES.UPDATE(id), data);
    return response.data.data;
  },

  /**
   * Delete store
   */
  async deleteStore(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.STORES.DELETE(id));
  },
};
