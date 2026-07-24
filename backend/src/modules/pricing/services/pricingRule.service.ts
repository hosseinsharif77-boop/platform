/**
 * Pricing Rule Service
 * 
 * Manages pricing rules for stores and products.
 */

import { PricingRule, PricingRuleStatus } from '../models';
import { cache } from '../../../database/cache';
import { eventBus, Events } from '../../../core/events';
import { logger } from '../../../core/logger';
import { NotFoundError } from '../../../core/errors';

export class PricingRuleService {
  private static instance: PricingRuleService;
  private cachePrefix = 'rules:';
  private cacheTTL = 600; // 10 minutes

  private constructor() {}

  static getInstance(): PricingRuleService {
    if (!PricingRuleService.instance) {
      PricingRuleService.instance = new PricingRuleService();
    }
    return PricingRuleService.instance;
  }

  /**
   * Get all rules for a store
   */
  async getRulesByStore(storeId: string): Promise<any[]> {
    return PricingRule.findByStore(storeId);
  }

  /**
   * Get active rules for a store
   */
  async getActiveRules(storeId: string): Promise<any[]> {
    return PricingRule.findActiveByStore(storeId);
  }

  /**
   * Get active rules for a product
   */
  async getActiveRulesForProduct(productId: string, storeId: string): Promise<any[]> {
    const cacheKey = `${this.cachePrefix}${storeId}:${productId}`;
    
    const cached = await cache.get<any[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const rules = await PricingRule.findActiveByProduct(productId, storeId);
    await cache.set(cacheKey, rules, { ttl: this.cacheTTL });
    
    return rules;
  }

  /**
   * Create a new pricing rule
   */
  async createRule(data: any, userId: string): Promise<any> {
    const rule = await PricingRule.create({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    });

    // Invalidate cache
    await this.invalidateCache(data.storeId, data.productId);

    // Emit event
    eventBus.emit(Events.PRICE_UPDATED, {
      productId: data.productId,
      storeId: data.storeId,
    });

    logger.audit('Pricing rule created', userId, 'PricingRule', rule._id);

    return rule;
  }

  /**
   * Update a pricing rule
   */
  async updateRule(ruleId: string, data: any, userId: string): Promise<any> {
    const rule = await PricingRule.findByIdAndUpdate(
      ruleId,
      { ...data, updatedBy: userId },
      { new: true, runValidators: true }
    );

    if (!rule) {
      throw new NotFoundError('Pricing rule', ruleId);
    }

    // Invalidate cache
    await this.invalidateCache(rule.storeId, rule.productId);

    // Emit event
    eventBus.emit(Events.PRICE_UPDATED, {
      productId: rule.productId,
      storeId: rule.storeId,
    });

    logger.audit('Pricing rule updated', userId, 'PricingRule', ruleId);

    return rule;
  }

  /**
   * Delete a pricing rule (soft delete)
   */
  async deleteRule(ruleId: string, userId: string): Promise<void> {
    const rule = await PricingRule.findByIdAndUpdate(
      ruleId,
      { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
      { new: true }
    );

    if (!rule) {
      throw new NotFoundError('Pricing rule', ruleId);
    }

    // Invalidate cache
    await this.invalidateCache(rule.storeId, rule.productId);

    // Emit event
    eventBus.emit(Events.PRICE_UPDATED, {
      productId: rule.productId,
      storeId: rule.storeId,
    });

    logger.audit('Pricing rule deleted', userId, 'PricingRule', ruleId);
  }

  /**
   * Toggle rule status
   */
  async toggleRuleStatus(ruleId: string, userId: string): Promise<any> {
    const rule = await PricingRule.findById(ruleId);
    
    if (!rule) {
      throw new NotFoundError('Pricing rule', ruleId);
    }

    const newStatus = rule.status === PricingRuleStatus.ACTIVE
      ? PricingRuleStatus.INACTIVE
      : PricingRuleStatus.ACTIVE;

    return this.updateRule(ruleId, { status: newStatus }, userId);
  }

  /**
   * Evaluate conditions against context
   */
  evaluateConditions(conditions: any[], context: any): boolean {
    return conditions.every((condition) => {
      const value = this.getNestedValue(context, condition.field);
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'not_equals':
          return value !== condition.value;
        case 'greater_than':
          return value > condition.value;
        case 'less_than':
          return value < condition.value;
        case 'between':
          return value >= condition.value[0] && value <= condition.value[1];
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(value);
        default:
          return true;
      }
    });
  }

  /**
   * Get nested value from object
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Invalidate cache
   */
  private async invalidateCache(storeId: string, productId?: string): Promise<void> {
    if (productId) {
      await cache.del(`${this.cachePrefix}${storeId}:${productId}`);
    }
    await cache.delByPattern(`${this.cachePrefix}${storeId}:*`);
  }
}

export const pricingRuleService = PricingRuleService.getInstance();
export default pricingRuleService;
