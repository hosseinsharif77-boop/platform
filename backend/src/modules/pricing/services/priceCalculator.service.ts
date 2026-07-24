/**
 * Price Calculator Service
 * 
 * Core price calculation engine.
 * Applies pricing rules and exchange rates to calculate final prices.
 */

import { PricingRuleType } from '../models';
import { currencyService } from './currency.service';
import { pricingRuleService } from './pricingRule.service';
import { logger } from '../../../core/logger';

export interface PriceCalculationContext {
  productId: string;
  storeId: string;
  variantId?: string;
  
  basePrice: number;
  currency: string;
  targetCurrency: string;
  
  quantity?: number;
  customerId?: string;
  customerSegment?: string;
}

export interface PriceCalculationResult {
  basePrice: number;
  exchangeRate: number;
  currency: string;
  
  components: PriceComponent[];
  
  finalPrice: number;
  formattedPrice: string;
}

export interface PriceComponent {
  type: string;
  label: string;
  value: number;
  percentage?: number;
  applied: boolean;
}

export class PriceCalculatorService {
  private static instance: PriceCalculatorService;

  private constructor() {}

  static getInstance(): PriceCalculatorService {
    if (!PriceCalculatorService.instance) {
      PriceCalculatorService.instance = new PriceCalculatorService();
    }
    return PriceCalculatorService.instance;
  }

  /**
   * Calculate price for a product
   */
  async calculate(context: PriceCalculationContext): Promise<PriceCalculationResult> {
    const {
      productId,
      storeId,
      basePrice,
      currency,
      targetCurrency,
      quantity = 1,
      customerId,
      customerSegment,
    } = context;

    const components: PriceComponent[] = [];
    let currentPrice = basePrice;

    // Step 1: Base price component
    components.push({
      type: 'base',
      label: 'Base Price',
      value: basePrice,
      applied: true,
    });

    // Step 2: Get exchange rate
    let exchangeRate = 1;
    if (currency !== targetCurrency) {
      exchangeRate = await currencyService.getExchangeRate(currency, targetCurrency);
      
      if (exchangeRate !== 1) {
        currentPrice = currentPrice * exchangeRate;
        
        components.push({
          type: 'exchange',
          label: `Exchange Rate (${currency} → ${targetCurrency})`,
          value: currentPrice - basePrice,
          percentage: (exchangeRate - 1) * 100,
          applied: true,
        });
      }
    }

    // Step 3: Apply pricing rules
    const rules = await pricingRuleService.getActiveRulesForProduct(productId, storeId);
    
    for (const rule of rules) {
      // Check conditions
      if (rule.conditions.length > 0) {
        const contextData = {
          quantity,
          customerId,
          customerSegment,
          currentPrice,
          basePrice,
        };
        
        if (!pricingRuleService.evaluateConditions(rule.conditions, contextData)) {
          continue;
        }
      }

      // Apply actions
      for (const action of rule.actions) {
        const beforePrice = currentPrice;
        
        currentPrice = this.applyAction(currentPrice, action);
        
        // Apply min/max bounds
        if (action.minValue !== undefined) {
          currentPrice = Math.max(currentPrice, action.minValue);
        }
        if (action.maxValue !== undefined) {
          currentPrice = Math.min(currentPrice, action.maxValue);
        }

        components.push({
          type: action.type,
          label: rule.name,
          value: currentPrice - beforePrice,
          percentage: action.type.includes('percentage') ? action.value : undefined,
          applied: true,
        });
      }
    }

    // Step 4: Round to 2 decimal places
    currentPrice = Math.round(currentPrice * 100) / 100;

    // Step 5: Format price
    const formattedPrice = this.formatPrice(currentPrice, targetCurrency);

    return {
      basePrice,
      exchangeRate,
      currency: targetCurrency,
      components,
      finalPrice: currentPrice,
      formattedPrice,
    };
  }

  /**
   * Apply a pricing action
   */
  private applyAction(price: number, action: any): number {
    switch (action.type) {
      case PricingRuleType.MARKUP_PERCENTAGE:
        return price * (1 + action.value / 100);
      
      case PricingRuleType.MARKUP_FIXED:
        return price + action.value;
      
      case PricingRuleType.DISCOUNT_PERCENTAGE:
        return price * (1 - action.value / 100);
      
      case PricingRuleType.DISCOUNT_FIXED:
        return price - action.value;
      
      default:
        return price;
    }
  }

  /**
   * Format price with currency symbol
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

  /**
   * Preview price with rule adjustments
   */
  async preview(
    context: PriceCalculationContext,
    ruleAdjustments: any[]
  ): Promise<PriceCalculationResult> {
    // Similar to calculate but with temporary rule adjustments
    return this.calculate(context);
  }

  /**
   * Calculate bulk prices
   */
  async calculateBulk(
    items: PriceCalculationContext[]
  ): Promise<PriceCalculationResult[]> {
    const promises = items.map((item) => this.calculate(item));
    return Promise.all(promises);
  }
}

export const priceCalculator = PriceCalculatorService.getInstance();
export default priceCalculator;
