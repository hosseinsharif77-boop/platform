/**
 * Pricing Validators
 * 
 * Zod schemas for request validation.
 */

import { z } from 'zod';

// ===========================================
// PRICE CALCULATION VALIDATORS
// ===========================================

export const calculatePriceSchema = z.object({
  productId: z.string().min(1),
  storeId: z.string().min(1),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1).optional(),
  currency: z.string().length(3).optional(),
  customerId: z.string().optional(),
  forceRecalculate: z.boolean().optional(),
  ignoreCache: z.boolean().optional(),
});

export const bulkCalculatePriceSchema = z.object({
  items: z.array(calculatePriceSchema).min(1).max(100),
  currency: z.string().length(3).optional(),
});

// ===========================================
// PRICE LOCK VALIDATORS
// ===========================================

export const priceLockSchema = z.object({
  productId: z.string().min(1),
  storeId: z.string().min(1),
  variantId: z.string().optional(),
  durationMinutes: z.number().int().min(1).max(60).optional(),
});

// ===========================================
// PRICE ROLLBACK VALIDATORS
// ===========================================

export const priceRollbackSchema = z.object({
  productId: z.string().min(1),
  storeId: z.string().min(1),
  targetVersion: z.number().int().min(1),
  reason: z.string().max(500).optional(),
});

// ===========================================
// PRICING RULE VALIDATORS
// ===========================================

export const pricingRuleCreateSchema = z.object({
  storeId: z.string().min(1),
  productId: z.string().optional(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  type: z.enum([
    'markup_percentage',
    'markup_fixed',
    'discount_percentage',
    'discount_fixed',
    'dynamic',
    'competitive',
    'time_based',
    'volume_based',
  ]),
  priority: z.number().int().min(0).optional(),
  conditions: z.array(z.object({
    field: z.string(),
    operator: z.enum(['equals', 'not_equals', 'greater_than', 'less_than', 'between', 'in']),
    value: z.any(),
  })).optional(),
  actions: z.array(z.object({
    type: z.enum([
      'markup_percentage',
      'markup_fixed',
      'discount_percentage',
      'discount_fixed',
    ]),
    value: z.number(),
    minValue: z.number().optional(),
    maxValue: z.number().optional(),
  })).min(1),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const pricingRuleUpdateSchema = pricingRuleCreateSchema.partial().omit({ storeId: true });

// ===========================================
// EXCHANGE RATE VALIDATORS
// ===========================================

export const exchangeRateUpdateSchema = z.object({
  from: z.string().length(3).toUpperCase(),
  to: z.string().length(3).toUpperCase(),
  rate: z.number().positive(),
  source: z.string().min(1).max(100),
});

export const exchangeRateBulkUpdateSchema = z.object({
  baseCurrency: z.string().length(3).toUpperCase(),
  rates: z.record(z.string().length(3), z.number().positive()),
  source: z.string().min(1).max(100),
});

// ===========================================
// QUERY VALIDATORS
// ===========================================

export const priceHistoryQuerySchema = z.object({
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const pricingRulesQuerySchema = z.object({
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  status: z.enum(['active', 'inactive', 'scheduled', 'expired']).optional(),
  type: z.string().optional(),
});
