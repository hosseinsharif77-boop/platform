/**
 * Pricing Queues
 * 
 * Queue definitions for pricing operations.
 */

import { createQueue } from '../../queues/config';

// ===========================================
// PRICE RECALCULATION QUEUE
// ===========================================

export const priceRecalculateQueue = createQueue('pricing-recalculate', {
  removeOnComplete: 100,
  removeOnFail: 50,
  attempts: 3,
});

// ===========================================
// BULK PRICE UPDATE QUEUE
// ===========================================

export const bulkPriceUpdateQueue = createQueue('pricing-bulk-update', {
  removeOnComplete: 50,
  removeOnFail: 25,
  attempts: 2,
});

// ===========================================
// EXCHANGE RATE UPDATE QUEUE
// ===========================================

export const exchangeUpdateQueue = createQueue('pricing-exchange-update', {
  removeOnComplete: 200,
  removeOnFail: 100,
  attempts: 5,
});

// ===========================================
// PRICE HISTORY QUEUE
// ===========================================

export const priceHistoryQueue = createQueue('pricing-history', {
  removeOnComplete: 500,
  removeOnFail: 100,
  attempts: 3,
});

// ===========================================
// SCHEDULED UPDATE QUEUE
// ===========================================

export const scheduledUpdateQueue = createQueue('pricing-scheduled-update', {
  removeOnComplete: 50,
  removeOnFail: 25,
  attempts: 2,
});

export default {
  priceRecalculateQueue,
  bulkPriceUpdateQueue,
  exchangeUpdateQueue,
  priceHistoryQueue,
  scheduledUpdateQueue,
};
