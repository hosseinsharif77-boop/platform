/**
 * Currency Service
 * 
 * Handles currency operations and exchange rate management.
 */

import { ExchangeRate } from '../models';
import { providerRegistry } from '../providers';
import { cache } from '../../../database/cache';
import { logger } from '../../../core/logger';

export class CurrencyService {
  private static instance: CurrencyService;
  private cachePrefix = 'exchange:';
  private cacheTTL = 60; // 1 minute

  private constructor() {}

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  /**
   * Get exchange rate between two currencies
   */
  async getExchangeRate(from: string, to: string): Promise<number> {
    if (from === to) return 1;

    const cacheKey = `${this.cachePrefix}${from}:${to}`;
    
    // Try cache first
    const cached = await cache.get<number>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // Try database
    const dbRate = await ExchangeRate.getRate(from, to);
    if (dbRate !== 1) {
      await cache.set(cacheKey, dbRate, { ttl: this.cacheTTL });
      return dbRate;
    }

    // Try provider
    try {
      const rate = await providerRegistry.getExchangeRate(from, to);
      
      // Save to database
      await ExchangeRate.updateRate(from, to, rate, 'provider');
      
      // Cache
      await cache.set(cacheKey, rate, { ttl: this.cacheTTL });
      
      return rate;
    } catch (error) {
      logger.error('Failed to get exchange rate', error, { from, to });
      return 1; // Default to 1 if all fails
    }
  }

  /**
   * Get all exchange rates for a base currency
   */
  async getExchangeRates(baseCurrency: string): Promise<Record<string, number>> {
    const cacheKey = `${this.cachePrefix}all:${baseCurrency}`;
    
    const cached = await cache.get<Record<string, number>>(cacheKey);
    if (cached) {
      return cached;
    }

    const rates = await ExchangeRate.getLatestRates(baseCurrency);
    await cache.set(cacheKey, rates, { ttl: this.cacheTTL });
    
    return rates;
  }

  /**
   * Update exchange rate manually
   */
  async updateExchangeRate(
    from: string,
    to: string,
    rate: number,
    source: string
  ): Promise<void> {
    await ExchangeRate.updateRate(from, to, rate, source);
    
    // Invalidate cache
    const cacheKey = `${this.cachePrefix}${from}:${to}`;
    await cache.del(cacheKey);
    
    logger.info('Exchange rate updated', { from, to, rate, source });
  }

  /**
   * Bulk update exchange rates
   */
  async bulkUpdateRates(
    baseCurrency: string,
    rates: Record<string, number>,
    source: string
  ): Promise<void> {
    const promises = Object.entries(rates).map(([to, rate]) =>
      ExchangeRate.updateRate(baseCurrency, to, rate, source)
    );
    
    await Promise.all(promises);
    
    // Invalidate cache
    const cacheKey = `${this.cachePrefix}all:${baseCurrency}`;
    await cache.del(cacheKey);
    
    logger.info('Bulk exchange rates updated', { baseCurrency, count: Object.keys(rates).length });
  }

  /**
   * Get supported currencies
   */
  getSupportedCurrencies(): string[] {
    return providerRegistry.getAll()[0]?.getSupportedCurrencies() || [
      'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD',
    ];
  }

  /**
   * Convert amount between currencies
   */
  async convert(amount: number, from: string, to: string): Promise<number> {
    if (from === to) return amount;
    
    const rate = await this.getExchangeRate(from, to);
    return Math.round(amount * rate * 100) / 100; // Round to 2 decimal places
  }
}

export const currencyService = CurrencyService.getInstance();
export default currencyService;
