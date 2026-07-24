/**
 * Cart Routes
 * 
 * API routes for cart and checkout operations.
 */

import { Router } from 'express';
import { cartController } from '../controllers';
import { authenticate, optionalAuth, validate } from '../../../middlewares';
import {
  addToCartSchema,
  updateCartItemSchema,
  checkoutInfoSchema,
  shippingAddressSchema,
  shippingMethodSchema,
} from '../validators';

const router = Router();

// ===========================================
// CART OPERATIONS
// ===========================================

router.get(
  '/',
  optionalAuth,
  cartController.getCart
);

router.post(
  '/items',
  optionalAuth,
  validate(addToCartSchema),
  cartController.addItem
);

router.put(
  '/items/:itemId',
  optionalAuth,
  validate(updateCartItemSchema),
  cartController.updateItem
);

router.delete(
  '/items/:itemId',
  optionalAuth,
  cartController.removeItem
);

router.delete(
  '/',
  optionalAuth,
  cartController.clearCart
);

router.post(
  '/validate',
  optionalAuth,
  cartController.validateCart
);

router.post(
  '/merge',
  authenticate,
  cartController.mergeCart
);

// ===========================================
// PRICE LOCK
// ===========================================

router.post(
  '/lock',
  authenticate,
  cartController.lockPrices
);

router.get(
  '/lock/status',
  authenticate,
  cartController.getLockStatus
);

router.delete(
  '/lock/:lockId',
  authenticate,
  cartController.releaseLock
);

// ===========================================
// CHECKOUT
// ===========================================

router.post(
  '/checkout/session',
  authenticate,
  cartController.createCheckoutSession
);

router.get(
  '/checkout/session/:sessionId',
  authenticate,
  cartController.getCheckoutSession
);

router.put(
  '/checkout/session/:sessionId',
  authenticate,
  cartController.updateCheckoutSession
);

router.put(
  '/checkout/session/:sessionId/step',
  authenticate,
  cartController.updateCheckoutStep
);

router.get(
  '/checkout/session/:sessionId/preview',
  authenticate,
  cartController.previewCheckout
);

router.post(
  '/checkout/session/:sessionId/complete',
  authenticate,
  cartController.completeCheckout
);

export default router;
