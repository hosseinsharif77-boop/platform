/**
 * Marketplace Hooks
 * 
 * React hooks for marketplace operations.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { productApi, categoryApi, brandApi, storeApi, searchApi } from '../services';
import {
  Product,
  Category,
  Brand,
  Store,
  SearchFilters,
  SearchSuggestion,
  Pagination,
} from '../types';

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
// USE PRODUCTS
// ===========================================

export function useProducts(type: 'featured' | 'newest' | 'trending' = 'featured', limit = 8) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let result: Product[];
        switch (type) {
          case 'featured':
            result = await productApi.getFeaturedProducts(limit);
            break;
          case 'newest':
            result = await productApi.getNewestProducts(limit);
            break;
          case 'trending':
            result = await productApi.getTrendingProducts(limit);
            break;
          default:
            result = await productApi.getFeaturedProducts(limit);
        }
        setProducts(result);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type, limit]);

  return { products, loading, error };
}

// ===========================================
// USE CATEGORIES
// ===========================================

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await categoryApi.getCategories();
        setCategories(result);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

// ===========================================
// USE SEARCH
// ===========================================

export function useSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const result = await searchApi.getSuggestions(searchQuery);
      setSuggestions(result);
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        fetchSuggestions(query);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, fetchSuggestions]);

  return {
    query,
    setQuery,
    suggestions,
    loading,
    showSuggestions,
    setShowSuggestions,
  };
}

// ===========================================
// USE SEARCH RESULTS
// ===========================================

export function useSearchResults(initialFilters: SearchFilters = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await searchApi.search(filters);
        setProducts(result.products);
        setPagination({
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: result.totalCount,
          pages: Math.ceil(result.totalCount / (filters.limit || 20)),
          hasNext: (filters.page || 1) * (filters.limit || 20) < result.totalCount,
          hasPrev: (filters.page || 1) > 1,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to search products');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [filters]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    products,
    pagination,
    loading,
    error,
    filters,
    updateFilters,
  };
}

// ===========================================
// USE STORE
// ===========================================

export function useStore(slug: string | null) {
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchStore = async () => {
      setLoading(true);
      setError(null);
      try {
        const [storeResult, productsResult] = await Promise.all([
          storeApi.getStoreBySlug(slug),
          storeApi.getStoreProducts(slug),
        ]);
        setStore(storeResult);
        setProducts(productsResult.products);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch store');
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [slug]);

  return { store, products, loading, error };
}

// ===========================================
// USE PRICE UPDATE
// ===========================================

export function usePriceUpdate(productId: string, interval = 30000) {
  const [price, setPrice] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setIsUpdating(true);
        const product = await productApi.getProduct(productId);
        setPrice(product.livePrice);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Failed to fetch price:', err);
      } finally {
        setIsUpdating(false);
      }
    };

    fetchPrice();
    const intervalId = setInterval(fetchPrice, interval);

    return () => clearInterval(intervalId);
  }, [productId, interval]);

  return { price, lastUpdated, isUpdating };
}
