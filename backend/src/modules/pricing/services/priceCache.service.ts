/**
 * Price Cache Service
 * 
 * Redis-based caching for prices.
 */

import { cache } from '../../../database/cache';
import { logger } from '../../../core/logger';

export interface CachedPrice {
  productId: string;
  storeId: string;
  price: number;
  currency: string;
  exchangeRate: number;
  cachedAt: Date;
  expiresAt: Date;
}

export class PriceCacheService {
  private static instance: PriceCacheService;
  private prefix = 'price:';
  private defaultTTL = 300; // 5 minutes

  private constructor() {}

  static getInstance(): PriceCacheService {
    if (!PriceCacheService.instance) {
      PriceCacheService.instance = new PriceCacheService();
    }
    return PriceCacheService.instance;
  }

  /**
   * Get cached price
   */
  async getPrice(productId: string, storeId: string): Promise<CachedPrice | null> {
    const key = this.getKey(productId, storeId);
    return cache.get<CachedPrice>(key);
  }

  /**
   * Set cached price
   */
  async setPrice(
    productId: string,
    storeId: string,
    price: number,
    currency: string,
    exchangeRate: number,
    ttl?: number
  ): Promise<void> {
    const key = this.getKey(productId, storeId);
    const cachedPrice: CachedPrice = {
      productId,
      storeId,
      price,
      currency,
      exchangeRate,
      cachedAt: new Date(),
      expiresAt: new Date(Date.now() + (ttl || this.defaultTTL) * 1000),
    };

    await cache.set(key, cachedPrice, { ttl: ttl || this.defaultTTL });
  }

  /**
   * Invalidate price cache
   */
  async invalidatePrice(productId: string, storeId: string): Promise<void> {
    const key = this.getKey(productId, storeId);
    await cache.del(key);
  }

  /**
   * Invalidate all prices for a store
   */
  async invalidateStore(storeId: string): Promise<void> {
    await cache.delByPattern(`${this.prefix}${storeId}:*`);
  }

  /**
   * Invalidate all prices for a product
   */
  async invalidateProduct(productId: string): Promise<void> {
    await cache.delByPattern(`${this.prefix}*:${productId}`);
  }

  /**
   * Bulk get prices
   */
  async bulkGetPrices(
    items: { productId: string; storeId: string }[]
  ): Promise<Map<string, CachedPrice | null>> {
    const results = new Map<string, CachedPrice | null>();

    await Promise.all(
      items.map(async (item) => {
        const price = await this.getPrice(item.productId, item.storeId);
        results.set(`${item.productId}:${item.storeId}`, price);
      })
    );

    return results;
  }

  /**
   * Bulk set prices
   */
  async bulkSetPrices(
    prices: {
      productId: string;
      storeId: string;
      price: number;
      currency: string;
      exchangeRate: number;
    }[],
    ttl?: number
  ): Promise<void> {
    await Promise.all(
      prices.map((p) =>
        this.setPrice(p.productId, p.storeId, p.price, p.currency, p.exchangeRate, ttl)
      )
    );
  }

  /**
   * Get cache stats
   */
  async getStats(): Promise<{
    hitCount: number;
    missCount: number;
    hitRate: number;
  }> {
    // TODO: Track hit/miss stats
    return {
      hitCount: 0,
      missCount: 0,
      hitRate: 0,
    };
  }

  /**
   * Warm cache for store
   */
  async warmCache(storeId: string, products: any[]): Promise<void> {
    logger.info(`Warming cache for store ${storeId}`, {
      productCount: products.length,
    });

    await this.bulkSetPrices(
      products.map((p) => ({
        productId: p._id,
        storeId,
        price: p.livePrice || p.basePrice,
        currency: p.currency || 'USD',
        exchangeRate: 1,
      }))
    );
  }

  /**
   * Get cache key
   */
  private getKey(productId: string, storeId: string): string {
    return `${this.prefix}${storeId}:${productId}`;
  }
}

export const priceCache = PriceCacheService.getInstance();
export default priceCache;
