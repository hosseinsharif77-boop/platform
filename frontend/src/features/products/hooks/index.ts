/**
 * Product Hooks
 * 
 * React hooks for product operations.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { productApi } from '../services';
import {
  Product,
  ProductListResponse,
  ProductFilters,
  CreateProductDTO,
  UpdateProductDTO,
  UpdateInventoryDTO,
  ProductStats,
} from '../types';

// ===========================================
// USE PRODUCTS
// ===========================================

export function useProducts(initialFilters: ProductFilters = {}) {
  const [data, setData] = useState<ProductListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await productApi.getProducts(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return {
    products: data?.products || [],
    pagination: data?.pagination,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refetch: fetchProducts,
  };
}

// ===========================================
// USE PRODUCT
// ===========================================

export function useProduct(id: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await productApi.getProduct(id);
        setProduct(result);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}

// ===========================================
// USE PRODUCT MUTATIONS
// ===========================================

export function useProductMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (data: CreateProductDTO): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const product = await productApi.createProduct(data);
      return product;
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, data: UpdateProductDTO): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const product = await productApi.updateProduct(id, data);
      return product;
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await productApi.deleteProduct(id);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const publishProduct = async (id: string): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const product = await productApi.publishProduct(id);
      return product;
    } catch (err: any) {
      setError(err.message || 'Failed to publish product');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const archiveProduct = async (id: string): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const product = await productApi.archiveProduct(id);
      return product;
    } catch (err: any) {
      setError(err.message || 'Failed to archive product');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const duplicateProduct = async (id: string): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const product = await productApi.duplicateProduct(id);
      return product;
    } catch (err: any) {
      setError(err.message || 'Failed to duplicate product');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateInventory = async (id: string, data: UpdateInventoryDTO): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const product = await productApi.updateInventory(id, data);
      return product;
    } catch (err: any) {
      setError(err.message || 'Failed to update inventory');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    publishProduct,
    archiveProduct,
    duplicateProduct,
    updateInventory,
  };
}

// ===========================================
// USE PRODUCT STATS
// ===========================================

export function useProductStats() {
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [stockSummary, setStockSummary] = useState<{
    totalProducts: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [counts, stock] = await Promise.all([
          productApi.getStatusCounts(),
          productApi.getStockSummary(),
        ]);
        setStatusCounts(counts);
        setStockSummary(stock);
      } catch (err) {
        console.error('Failed to fetch product stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { statusCounts, stockSummary, loading };
}
