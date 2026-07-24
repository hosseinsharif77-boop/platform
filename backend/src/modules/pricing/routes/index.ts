/**
 * Pricing Routes
 * 
 * API routes for pricing operations.
 */

import { Router } from 'express';
import { pricingController } from '../controllers';
import { authenticate, authorize, validate } from '../../../middlewares';
import {
  calculatePriceSchema,
  bulkCalculatePriceSchema,
  priceLockSchema,
  priceRollbackSchema,
  pricingRuleCreateSchema,
  pricingRuleUpdateSchema,
  exchangeRateUpdateSchema,
  exchangeRateBulkUpdateSchema,
} from '../validators';

const router = Router();

// ===========================================
// PRICE CALCULATION
// ===========================================

router.post(
  '/calculate',
  authenticate,
  validate(calculatePriceSchema),
  pricingController.calculatePrice
);

router.post(
  '/bulk-calculate',
  authenticate,
  validate(bulkCalculatePriceSchema),
  pricingController.bulkCalculatePrice
);

router.get(
  '/:productId',
  authenticate,
  pricingController.getPrice
);

// ===========================================
// PRICE LOCK
// ===========================================

router.post(
  '/lock',
  authenticate,
  validate(priceLockSchema),
  pricingController.lockPrice
);

router.delete(
  '/locks/:lockId',
  authenticate,
  pricingController.releaseLock
);

router.get(
  '/locks/my',
  authenticate,
  pricingController.getUserLocks
);

// ===========================================
// PRICE HISTORY
// ===========================================

router.get(
  '/history/:productId',
  authenticate,
  pricingController.getPriceHistory
);

router.get(
  '/versions/:productId',
  authenticate,
  pricingController.getPriceVersions
);

router.post(
  '/rollback',
  authenticate,
  validate(priceRollbackSchema),
  pricingController.rollbackPrice
);

// ===========================================
// EXCHANGE RATES
// ===========================================

router.get(
  '/exchange/:from/:to',
  authenticate,
  pricingController.getExchangeRate
);

router.post(
  '/exchange/update',
  authenticate,
  authorize('admin'),
  validate(exchangeRateUpdateSchema),
  pricingController.updateExchangeRate
);

router.post(
  '/exchange/bulk-update',
  authenticate,
  authorize('admin'),
  validate(exchangeRateBulkUpdateSchema),
  pricingController.bulkUpdateExchangeRates
);

// ===========================================
// PRICING RULES
// ===========================================

router.get(
  '/rules',
  authenticate,
  pricingController.getRules
);

router.post(
  '/rules',
  authenticate,
  authorize('vendor', 'admin'),
  validate(pricingRuleCreateSchema),
  pricingController.createRule
);

router.put(
  '/rules/:ruleId',
  authenticate,
  authorize('vendor', 'admin'),
  validate(pricingRuleUpdateSchema),
  pricingController.updateRule
);

router.delete(
  '/rules/:ruleId',
  authenticate,
  authorize('vendor', 'admin'),
  pricingController.deleteRule
);

router.post(
  '/rules/:ruleId/toggle',
  authenticate,
  authorize('vendor', 'admin'),
  pricingController.toggleRuleStatus
);

router.post(
  '/rules/:ruleId/preview',
  authenticate,
  authorize('vendor', 'admin'),
  pricingController.previewRule
);

export default router;
