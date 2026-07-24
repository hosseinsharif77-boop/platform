/**
 * Cart Controller
 * 
 * Handles HTTP requests for cart operations.
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../middlewares';
import { cartService, priceLockService, checkoutService } from '../services';
import { sendSuccess } from '../../../utils/response';

class CartController {
  private static instance: CartController;

  private constructor() {}

  static getInstance(): CartController {
    if (!CartController.instance) {
      CartController.instance = new CartController();
    }
    return CartController.instance;
  }

  /**
   * Get cart
   */
  getCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const sessionId = req.headers['x-session-id'] as string;

      const cart = await cartService.getCart(userId, sessionId);

      sendSuccess(res, cart, 'Cart retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Add item to cart
   */
  addItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const sessionId = req.headers['x-session-id'] as string;
      const { productId, quantity } = req.body;

      const cart = await cartService.addItem(userId, sessionId, productId, quantity);

      sendSuccess(res, cart, 'Item added to cart', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update cart item
   */
  updateItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { itemId } = req.params;
      const { quantity } = req.body;
      const cartId = req.params.cartId || req.headers['x-cart-id'];

      const cart = await cartService.updateItem(
        cartId as string,
        itemId,
        quantity,
        userId
      );

      sendSuccess(res, cart, 'Cart updated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Remove item from cart
   */
  removeItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { itemId } = req.params;
      const cartId = req.params.cartId || req.headers['x-cart-id'];

      const cart = await cartService.removeItem(
        cartId as string,
        itemId,
        userId
      );

      sendSuccess(res, cart, 'Item removed from cart');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Clear cart
   */
  clearCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const cartId = req.params.cartId || req.headers['x-cart-id'];

      const cart = await cartService.clearCart(cartId as string, userId);

      sendSuccess(res, cart, 'Cart cleared successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Validate cart
   */
  validateCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const sessionId = req.headers['x-session-id'] as string;

      const cart = await cartService.getCart(userId, sessionId);
      const validation = await cartService.validateCartPrices(cart);

      sendSuccess(res, validation, 'Cart validated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Merge guest cart
   */
  mergeCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { sessionId } = req.body;

      const cart = await cartService.mergeCarts(userId, sessionId);

      sendSuccess(res, cart, 'Cart merged successfully');
    } catch (error) {
      next(error);
    }
  };

  // ===========================================
  // PRICE LOCK
  // ===========================================

  /**
   * Lock prices
   */
  lockPrices = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { cartId } = req.body;

      const lock = await priceLockService.createLock(userId, cartId);

      sendSuccess(res, lock, 'Prices locked successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Check lock status
   */
  getLockStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;

      const lock = await priceLockService.getActiveLock(userId);

      sendSuccess(res, {
        active: !!lock,
        lock,
        timeRemaining: lock ? lock.getTimeRemaining() : 0,
      }, 'Lock status retrieved');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Release lock
   */
  releaseLock = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { lockId } = req.params;

      await priceLockService.releaseLock(lockId, userId);

      sendSuccess(res, null, 'Price lock released');
    } catch (error) {
      next(error);
    }
  };

  // ===========================================
  // CHECKOUT
  // ===========================================

  /**
   * Create checkout session
   */
  createCheckoutSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { cartId } = req.body;

      const result = await checkoutService.createSession(userId, cartId);

      sendSuccess(res, result, 'Checkout session created', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get checkout session
   */
  getCheckoutSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { sessionId } = req.params;

      const session = await checkoutService.getSession(sessionId, userId);

      sendSuccess(res, session, 'Checkout session retrieved');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update checkout session
   */
  updateCheckoutSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { sessionId } = req.params;

      const session = await checkoutService.updateSession(sessionId, userId, req.body);

      sendSuccess(res, session, 'Checkout session updated');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update checkout step
   */
  updateCheckoutStep = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { sessionId } = req.params;
      const { step } = req.body;

      const session = await checkoutService.updateStep(sessionId, userId, step);

      sendSuccess(res, session, 'Checkout step updated');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Preview checkout
   */
  previewCheckout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { sessionId } = req.params;

      const preview = await checkoutService.preview(sessionId, userId);

      sendSuccess(res, preview, 'Checkout preview retrieved');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Complete checkout
   */
  completeCheckout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { sessionId } = req.params;

      const result = await checkoutService.complete(sessionId, userId);

      sendSuccess(res, result, 'Checkout completed');
    } catch (error) {
      next(error);
    }
  };
}

export const cartController = CartController.getInstance();
export default cartController;
