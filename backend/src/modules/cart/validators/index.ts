/**
 * Cart Validators
 * 
 * Zod schemas for cart and checkout validation.
 */

import { z } from 'zod';

// ===========================================
// CART VALIDATORS
// ===========================================

export const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(100),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(100),
});

// ===========================================
// CHECKOUT VALIDATORS
// ===========================================

export const checkoutInfoSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
});

export const shippingAddressSchema = z.object({
  addressId: z.string().optional(),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  company: z.string().max(100).optional(),
  address1: z.string().min(1).max(200).optional(),
  address2: z.string().max(200).optional(),
  city: z.string().min(1).max(100).optional(),
  state: z.string().max(100).optional(),
  postalCode: z.string().min(1).max(20).optional(),
  country: z.string().length(2).optional(),
  phone: z.string().optional(),
});

export const shippingMethodSchema = z.object({
  methodId: z.string().min(1),
});

export const checkoutStepSchema = z.object({
  step: z.enum(['information', 'shipping', 'shipping_method', 'payment', 'review']),
});

// ===========================================
// ADDRESS VALIDATORS
// ===========================================

export const createAddressSchema = z.object({
  label: z.string().max(50).optional(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  company: z.string().max(100).optional(),
  address1: z.string().min(1).max(200),
  address2: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  state: z.string().max(100).optional(),
  postalCode: z.string().min(1).max(20),
  country: z.string().length(2),
  phone: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = createAddressSchema.partial();
