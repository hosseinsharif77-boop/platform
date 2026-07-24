/**
 * Pricing Controller
 * 
 * Handles HTTP requests for pricing operations.
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../middlewares';
import { pricingService, pricingRuleService, currencyService, priceLockService } from '../services';
import { sendSuccess, sendPaginated } from '../../../utils/response';

class PricingController {
  private static instance: PricingController;

  private constructor() {}

  static getInstance(): PricingController {
    if (!PricingController.instance) {
      PricingController.instance = new PricingController();
    }
    return PricingController.instance;
  }

  /**
   * Calculate price
   */
  calculatePrice = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { productId, storeId, variantId, quantity, currency, customerId, forceRecalculate, ignoreCache } = req.body;

      const price = await pricingService.calculatePrice({
        productId,
        storeId,
        variantId,
        quantity,
        targetCurrency: currency || 'USD',
        customerId,
        forceRecalculate,
        ignoreCache,
      });

      sendSuccess(res, price, 'Price calculated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Bulk calculate prices
   */
  bulkCalculatePrice = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { items, currency } = req.body;

      const prices = await pricingService.calculateBulkPrices(
        items.map((item: any) => ({
          ...item,
          targetCurrency: currency || 'USD',
        }))
      );

      sendSuccess(res, prices, 'Prices calculated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get price
   */
  getPrice = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { productId } = req.params;
      const { storeId, currency } = req.query;

      const price = await pricingService.calculatePrice({
        productId,
        storeId: storeId as string,
        targetCurrency: (currency as string) || 'USD',
      });

      sendSuccess(res, price, 'Price retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Lock price
   */
  lockPrice = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { productId, storeId, variantId, durationMinutes } = req.body;
      const userId = req.user!.id;

      const lock = await pricingService.lockPrice({
        productId,
        storeId,
        variantId,
        userId,
        durationMinutes,
      });

      sendSuccess(res, lock, 'Price locked successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Release lock
   */
  releaseLock = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { lockId } = req.params;
      const userId = req.user!.id;

      await priceLockService.releaseLock(lockId, userId);

      sendSuccess(res, null, 'Lock released successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user locks
   */
  getUserLocks = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;

      const locks = await priceLockService.getUserLocks(userId);

      sendSuccess(res, locks, 'Locks retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get price history
   */
  getPriceHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { productId } = req.params;
      const { limit } = req.query;

      const history = await pricingService.getPriceHistory(productId, Number(limit) || 50);

      sendSuccess(res, history, 'Price history retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get price versions
   */
  getPriceVersions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { productId } = req.params;

      const versions = await pricingService.getPriceVersions(productId);

      sendSuccess(res, versions, 'Price versions retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Rollback price
   */
  rollbackPrice = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { productId, storeId, targetVersion, reason } = req.body;
      const userId = req.user!.id;

      await pricingService.rollbackPrice(productId, storeId, targetVersion, userId, reason);

      sendSuccess(res, null, 'Price rolled back successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get exchange rate
   */
  getExchangeRate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { from, to } = req.params;

      const rate = await pricingService.getExchangeRate(from, to);

      sendSuccess(res, { from, to, rate }, 'Exchange rate retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update exchange rate
   */
  updateExchangeRate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { from, to, rate, source } = req.body;

      await currencyService.updateExchangeRate(from, to, rate, source);

      sendSuccess(res, null, 'Exchange rate updated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Bulk update exchange rates
   */
  bulkUpdateExchangeRates = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { baseCurrency, rates, source } = req.body;

      await currencyService.bulkUpdateRates(baseCurrency, rates, source);

      sendSuccess(res, null, 'Exchange rates updated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get rules
   */
  getRules = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { storeId } = req.query;

      const rules = await pricingRuleService.getRulesByStore(storeId as string);

      sendSuccess(res, rules, 'Rules retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create rule
   */
  createRule = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;

      const rule = await pricingRuleService.createRule(req.body, userId);

      sendSuccess(res, rule, 'Rule created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update rule
   */
  updateRule = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { ruleId } = req.params;
      const userId = req.user!.id;

      const rule = await pricingRuleService.updateRule(ruleId, req.body, userId);

      sendSuccess(res, rule, 'Rule updated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete rule
   */
  deleteRule = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { ruleId } = req.params;
      const userId = req.user!.id;

      await pricingRuleService.deleteRule(ruleId, userId);

      sendSuccess(res, null, 'Rule deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Toggle rule status
   */
  toggleRuleStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { ruleId } = req.params;
      const userId = req.user!.id;

      const rule = await pricingRuleService.toggleRuleStatus(ruleId, userId);

      sendSuccess(res, rule, 'Rule status toggled successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Preview rule
   */
  previewRule = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { ruleId } = req.params;
      const { productId, storeId } = req.body;

      // TODO: Implement rule preview
      sendSuccess(res, { preview: 'coming soon' }, 'Preview generated successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const pricingController = PricingController.getInstance();
export default pricingController;
