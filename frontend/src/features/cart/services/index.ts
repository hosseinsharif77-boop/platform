/**
 * Cart API Services
 * 
 * API calls for cart operations.
 */

import apiClient from '@/services/api';
import { Cart, CartValidationResult } from '../types';

export const cartApi = {
  /**
   * Get cart
   */
  async getCart(): Promise<Cart> {
    const response = await apiClient.get('/cart');
    return response.data.data;
  },

  /**
   * Add item to cart
   */
  async addItem(productId: string, quantity: number): Promise<Cart> {
    const response = await apiClient.post('/cart/items', { productId, quantity });
    return response.data.data;
  },

  /**
   * Update cart item
   */
  async updateItem(itemId: string, quantity: number): Promise<Cart> {
    const response = await apiClient.put(`/cart/items/${itemId}`, { quantity });
    return response.data.data;
  },

  /**
   * Remove item from cart
   */
  async removeItem(itemId: string): Promise<Cart> {
    const response = await apiClient.delete(`/cart/items/${itemId}`);
    return response.data.data;
  },

  /**
   * Clear cart
   */
  async clearCart(): Promise<Cart> {
    const response = await apiClient.delete('/cart');
    return response.data.data;
  },

  /**
   * Validate cart
   */
  async validateCart(): Promise<CartValidationResult> {
    const response = await apiClient.post('/cart/validate');
    return response.data.data;
  },

  /**
   * Merge guest cart
   */
  async mergeCart(sessionId: string): Promise<Cart> {
    const response = await apiClient.post('/cart/merge', { sessionId });
    return response.data.data;
  },
};

export default cartApi;
