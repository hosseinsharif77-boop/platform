/**
 * Pricing Queue Handlers
 * 
 * BullMQ job handlers for pricing operations.
 */

import { createWorker } from '../config';
import { pricingService } from '../../modules/pricing/services';
import { currencyService } from '../../modules/pricing/services';
import { priceHistoryService } from '../../modules/pricing/services';
import { logger } from '../../core/logger';

/**
 * Initialize pricing queue workers
 */
export const initializePricingWorkers = (): void => {
  // ===========================================
  // PRICE RECALCULATION WORKER
  // ===========================================

  createWorker('pricing-recalculate', async (job) => {
    const { productId, storeId, forceRecalculate } = job.data;
    
    logger.info(`Processing price recalculation for product ${productId}`);
    
    const price = await pricingService.calculatePrice({
      productId,
      storeId,
      targetCurrency: 'USD',
      forceRecalculate,
    });
    
    return { success: true, price };
  }, { concurrency: 5 });

  // ===========================================
  // BULK PRICE UPDATE WORKER
  // ===========================================

  createWorker('pricing-bulk-update', async (job) => {
    const { items } = job.data;
    
    logger.info(`Processing bulk price update for ${items.length} products`);
    
    const prices = await pricingService.calculateBulkPrices(items);
    
    return { success: true, count: prices.length };
  }, { concurrency: 3 });

  // ===========================================
  // EXCHANGE RATE UPDATE WORKER
  // ===========================================

  createWorker('pricing-exchange-update', async (job) => {
    const { from, to, rate, source } = job.data;
    
    logger.info(`Processing exchange rate update: ${from} → ${to} = ${rate}`);
    
    await currencyService.updateExchangeRate(from, to, rate, source);
    
    return { success: true };
  }, { concurrency: 5 });

  // ===========================================
  // PRICE HISTORY WORKER
  // ===========================================

  createWorker('pricing-history', async (job) => {
    const { data } = job.data;
    
    logger.info(`Recording price history for product ${data.productId}`);
    
    await priceHistoryService.recordChange(data);
    
    return { success: true };
  }, { concurrency: 10 });

  // ===========================================
  // SCHEDULED PRICE UPDATE WORKER
  // ===========================================

  createWorker('pricing-scheduled-update', async (job) => {
    const { storeId, productIds } = job.data;
    
    logger.info(`Processing scheduled price update for store ${storeId}`);
    
    // Recalculate prices for all products
    for (const productId of productIds) {
      await pricingService.calculatePrice({
        productId,
        storeId,
        targetCurrency: 'USD',
        forceRecalculate: true,
      });
    }
    
    return { success: true, processed: productIds.length };
  }, { concurrency: 1 });

  logger.info('✅ Pricing queue workers initialized');
};

export default initializePricingWorkers;
