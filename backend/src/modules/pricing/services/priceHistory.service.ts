/**
 * Price History Service
 * 
 * Records and retrieves price history.
 */

import { PriceHistory, PriceChangeReason } from '../models';
import { logger } from '../../../core/logger';

export class PriceHistoryService {
  private static instance: PriceHistoryService;

  private constructor() {}

  static getInstance(): PriceHistoryService {
    if (!PriceHistoryService.instance) {
      PriceHistoryService.instance = new PriceHistoryService();
    }
    return PriceHistoryService.instance;
  }

  /**
   * Record price change
   */
  async recordChange(data: {
    productId: string;
    storeId: string;
    variantId?: string;
    oldPrice: number;
    newPrice: number;
    currency: string;
    exchangeRate: number;
    reason: PriceChangeReason;
    description?: string;
    version: number;
    changedBy?: string;
    changedByType?: 'system' | 'seller' | 'admin';
    metadata?: Record<string, any>;
  }): Promise<any> {
    const entry = await PriceHistory.create({
      ...data,
      changedByType: data.changedByType || 'system',
    });

    logger.audit(
      'Price changed',
      data.changedBy || 'system',
      'Product',
      data.productId,
      {
        oldPrice: data.oldPrice,
        newPrice: data.newPrice,
        reason: data.reason,
        version: data.version,
      }
    );

    return entry;
  }

  /**
   * Get price history for a product
   */
  async getHistory(productId: string, limit = 50): Promise<any[]> {
    return PriceHistory.findByProduct(productId, limit);
  }

  /**
   * Get price history for a store
   */
  async getStoreHistory(storeId: string, limit = 100): Promise<any[]> {
    return PriceHistory.findByStore(storeId, limit);
  }

  /**
   * Get latest price entry
   */
  async getLatestPrice(productId: string): Promise<any | null> {
    return PriceHistory.getLatestPrice(productId);
  }

  /**
   * Get price history by date range
   */
  async getHistoryByDateRange(
    productId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    return PriceHistory.find({
      productId,
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ createdAt: -1 });
  }

  /**
   * Get price statistics
   */
  async getPriceStats(productId: string): Promise<{
    min: number;
    max: number;
    average: number;
    current: number;
    changes: number;
  }> {
    const history = await PriceHistory.find({ productId }).sort({ createdAt: -1 });
    
    if (history.length === 0) {
      return { min: 0, max: 0, average: 0, current: 0, changes: 0 };
    }

    const prices = history.map((h) => h.newPrice);
    
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      average: prices.reduce((a, b) => a + b, 0) / prices.length,
      current: history[0].newPrice,
      changes: history.length,
    };
  }
}

export const priceHistoryService = PriceHistoryService.getInstance();
export default priceHistoryService;
