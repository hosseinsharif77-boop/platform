/**
 * Cart Hooks
 * 
 * React hooks for cart operations.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { cartApi } from '../services';
import { Cart, CartValidationResult } from '../types';

// ===========================================
// USE CART
// ===========================================

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await cartApi.getCart();
      setCart(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return { cart, loading, error, refetch: fetchCart };
}

// ===========================================
// USE CART MUTATIONS
// ===========================================

export function useCartMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = async (productId: string, quantity: number): Promise<Cart | null> => {
    setLoading(true);
    setError(null);
    try {
      const cart = await cartApi.addItem(productId, quantity);
      return cart;
    } catch (err: any) {
      setError(err.message || 'Failed to add item');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId: string, quantity: number): Promise<Cart | null> => {
    setLoading(true);
    setError(null);
    try {
      const cart = await cartApi.updateItem(itemId, quantity);
      return cart;
    } catch (err: any) {
      setError(err.message || 'Failed to update item');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string): Promise<Cart | null> => {
    setLoading(true);
    setError(null);
    try {
      const cart = await cartApi.removeItem(itemId);
      return cart;
    } catch (err: any) {
      setError(err.message || 'Failed to remove item');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async (): Promise<Cart | null> => {
    setLoading(true);
    setError(null);
    try {
      const cart = await cartApi.clearCart();
      return cart;
    } catch (err: any) {
      setError(err.message || 'Failed to clear cart');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const validateCart = async (): Promise<CartValidationResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await cartApi.validateCart();
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to validate cart');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    validateCart,
  };
}
