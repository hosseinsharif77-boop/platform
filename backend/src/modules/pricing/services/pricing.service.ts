/**
 * Main Pricing Service
 * 
 * Orchestrates all pricing operations.
 * This is the main entry point for pricing-related operations.
 */

import { priceCalculator, PriceCalculationContext, PriceCalculationResult } from './priceCalculator.service';
import { currencyService } from './currency.service';
import { pricingRuleService } from './pricingRule.service';
import { priceHistoryService } from './priceHistory.service';
import { priceVersionService } from './priceVersion.service';
import { priceLockService } from './priceLock.service';
import { priceCache } from './priceCache.service';
import { PriceChangeReason } from '../models';
import { eventBus, Events } from '../../../core/events';
import { logger } from '../../../core/logger';

export class PricingService {
  private static instance: PricingService;

  private constructor() {}

  static getInstance(): PricingService {
    if (!PricingService.instance) {
      PricingService.instance = new PricingService();
    }
    return PricingService.instance;
  }

  /**
   * Calculate price for a product
   */
  async calculatePrice(context: PriceCalculationContext): Promise<PriceCalculationResult> {
    const { productId, storeId, forceRecalculate, ignoreCache } = context;

    // Try cache first
    if (!ignoreCache && !forceRecalculate) {
      const cached = await priceCache.getPrice(productId, storeId);
      if (cached) {
        return {
          basePrice: cached.price,
          exchangeRate: cached.exchangeRate,
          currency: cached.currency,
          components: [],
          finalPrice: cached.price,
          formattedPrice: this.formatPrice(cached.price, cached.currency),
        };
      }
    }

    // Calculate price
    const result = await priceCalculator.calculate(context);

    // Cache result
    await priceCache.setPrice(
      productId,
      storeId,
      result.finalPrice,
      result.currency,
      result.exchangeRate
    );

    return result;
  }

  /**
   * Bulk calculate prices
   */
  async calculateBulkPrices(
    items: PriceCalculationContext[]
  ): Promise<PriceCalculationResult[]> {
    // Check cache for all items
    const cacheResults = await priceCache.bulkGetPrices(
      items.map((i) => ({ productId: i.productId, storeId: i.storeId }))
    );

    const results: PriceCalculationResult[] = [];
    const uncachedItems: PriceCalculationContext[] = [];

    // Check which items are cached
    for (const item of items) {
      const cacheKey = `${item.productId}:${item.storeId}`;
      const cached = cacheResults.get(cacheKey);

      if (cached && !item.forceRecalculate) {
        results.push({
          basePrice: cached.price,
          exchangeRate: cached.exchangeRate,
          currency: cached.currency,
          components: [],
          finalPrice: cached.price,
          formattedPrice: this.formatPrice(cached.price, cached.currency),
        });
      } else {
        uncachedItems.push(item);
      }
    }

    // Calculate uncached items
    if (uncachedItems.length > 0) {
      const calculated = await priceCalculator.calculateBulk(uncachedItems);
      results.push(...calculated);

      // Cache calculated prices
      await priceCache.bulkSetPrices(
        calculated.map((c) => ({
          productId: uncachedItems[0].productId,
          storeId: uncachedItems[0].storeId,
          price: c.finalPrice,
          currency: c.currency,
          exchangeRate: c.exchangeRate,
        }))
      );
    }

    return results;
  }

  /**
   * Update product price
   */
  async updatePrice(data: {
    productId: string;
    storeId: string;
    newPrice: number;
    reason: PriceChangeReason;
    description?: string;
    userId?: string;
    userIdType?: 'system' | 'seller' | 'admin';
  }): Promise<void> {
    const { productId, storeId, newPrice, reason, description, userId, userIdType } = data;

    // Get current price
    const currentVersion = await priceVersionService.getLatestVersion(productId);
    const oldPrice = currentVersion?.price || 0;

    // Create new version
    const version = await priceVersionService.createVersion({
      productId,
      storeId,
      price: newPrice,
      currency: currentVersion?.currency || 'USD',
      basePrice: newPrice,
      exchangeRate: 1,
      createdBy: userId || 'system',
    });

    // Record history
    await priceHistoryService.recordChange({
      productId,
      storeId,
      oldPrice,
      newPrice,
      currency: currentVersion?.currency || 'USD',
      exchangeRate: 1,
      reason,
      description,
      version: version.version,
      changedBy: userId,
      changedByType: userIdType,
    });

    // Invalidate cache
    await priceCache.invalidatePrice(productId, storeId);

    // Emit event
    eventBus.emit(Events.PRICE_UPDATED, {
      productId,
      storeId,
      oldPrice,
      newPrice,
      reason,
      version: version.version,
    });

    logger.info('Price updated', {
      productId,
      oldPrice,
      newPrice,
      reason,
      version: version.version,
    });
  }

  /**
   * Rollback price
   */
  async rollbackPrice(
    productId: string,
    storeId: string,
    targetVersion: number,
    userId: string,
    reason?: string
  ): Promise<void> {
    await priceVersionService.rollback(
      productId,
      storeId,
      targetVersion,
      userId,
      reason
    );

    // Invalidate cache
    await priceCache.invalidatePrice(productId, storeId);
  }

  /**
   * Lock price
   */
  async lockPrice(data: {
    productId: string;
    storeId: string;
    variantId?: string;
    userId: string;
    durationMinutes?: number;
  }): Promise<any> {
    // Calculate current price
    const price = await this.calculatePrice({
      productId: data.productId,
      storeId: data.storeId,
      variantId: data.variantId,
      targetCurrency: 'USD',
    });

    return priceLockService.createLock({
      ...data,
      lockedPrice: price.finalPrice,
      currency: price.currency,
    });
  }

  /**
   * Get price history
   */
  async getPriceHistory(productId: string, limit?: number): Promise<any[]> {
    return priceHistoryService.getHistory(productId, limit);
  }

  /**
   * Get price versions
   */
  async getPriceVersions(productId: string): Promise<any[]> {
    return priceVersionService.getAllVersions(productId);
  }

  /**
   * Get exchange rate
   */
  async getExchangeRate(from: string, to: string): Promise<number> {
    return currencyService.getExchangeRate(from, to);
  }

  /**
   * Format price
   */
  private formatPrice(price: number, currency: string): string {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      IRR: '﷼',
      AED: 'د.إ',
    };
    const symbol = symbols[currency] || currency;
    return `${symbol}${price.toFixed(2)}`;
  }
}

export const pricingService = PricingService.getInstance();
export default pricingService;
