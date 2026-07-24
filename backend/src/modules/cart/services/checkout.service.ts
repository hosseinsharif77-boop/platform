/**
 * Checkout Service
 * 
 * Manages the checkout process.
 */

import { CheckoutSession, Cart, PriceLock } from '../models';
import { CheckoutStep, CheckoutStatus } from '../interfaces';
import { cache } from '../../../database/cache';
import { eventBus, Events } from '../../../core/events';
import { NotFoundError, BusinessError, ValidationError } from '../../../core/errors';
import { logger } from '../../../core/logger';

export class CheckoutService {
  private static instance: CheckoutService;

  private constructor() {}

  static getInstance(): CheckoutService {
    if (!CheckoutService.instance) {
      CheckoutService.instance = new CheckoutService();
    }
    return CheckoutService.instance;
  }

  /**
   * Create checkout session
   */
  async createSession(userId: string, cartId: string): Promise<any> {
    // Get cart
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new NotFoundError('Cart', cartId);
    }

    // Verify ownership
    if (cart.userId?.toString() !== userId) {
      throw new BusinessError('Unauthorized');
    }

    // Check cart is not empty
    if (cart.items.length === 0) {
      throw new BusinessError('Cart is empty');
    }

    // Create price lock
    const { PriceLock } = await import('../models');
    const lock = await PriceLock.create({
      userId,
      sessionId: cart.sessionId,
      items: cart.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        lockedPrice: item.currentPrice,
        originalPrice: item.unitPrice,
      })),
      lockedAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      durationMinutes: 15,
      status: 'active',
    });

    // Create checkout session
    const session = await CheckoutSession.create({
      userId,
      cartId,
      priceLockId: lock._id,
      currentStep: CheckoutStep.INFORMATION,
      status: CheckoutStatus.IN_PROGRESS,
      subtotal: cart.subtotal,
      shipping: 0,
      tax: 0,
      discount: 0,
      total: cart.subtotal,
      currency: cart.currency,
    });

    // Update cart status
    cart.status = 'checkout' as any;
    await cart.save();

    // Emit event
    eventBus.emit('checkout.started', {
      sessionId: session._id,
      userId,
      cartId,
    });

    logger.info('Checkout session created', {
      sessionId: session._id,
      userId,
      cartId,
    });

    return { session, priceLock: lock };
  }

  /**
   * Get checkout session
   */
  async getSession(sessionId: string, userId: string): Promise<any> {
    const session = await CheckoutSession.findById(sessionId);
    if (!session) {
      throw new NotFoundError('Checkout session', sessionId);
    }

    if (session.userId.toString() !== userId) {
      throw new BusinessError('Unauthorized');
    }

    return session;
  }

  /**
   * Update checkout session
   */
  async updateSession(
    sessionId: string,
    userId: string,
    data: any
  ): Promise<any> {
    const session = await this.getSession(sessionId, userId);

    // Check if price lock is still valid
    const { PriceLock } = await import('../models');
    const lock = await PriceLock.findById(session.priceLockId);
    if (!lock || lock.status !== 'active' || lock.isExpired()) {
      throw new BusinessError('Price lock has expired. Please restart checkout.');
    }

    // Update session
    Object.assign(session, data);
    await session.save();

    return session;
  }

  /**
   * Update checkout step
   */
  async updateStep(
    sessionId: string,
    userId: string,
    step: CheckoutStep
  ): Promise<any> {
    const session = await this.getSession(sessionId, userId);
    
    // Validate step progression
    const steps = Object.values(CheckoutStep);
    const currentIndex = steps.indexOf(session.currentStep);
    const newIndex = steps.indexOf(step);

    if (newIndex < currentIndex) {
      throw new BusinessError('Cannot go back to previous step');
    }

    session.currentStep = step;
    await session.save();

    return session;
  }

  /**
   * Preview checkout
   */
  async preview(sessionId: string, userId: string): Promise<any> {
    const session = await this.getSession(sessionId, userId);
    const cart = await Cart.findById(session.cartId);
    
    if (!cart) {
      throw new NotFoundError('Cart');
    }

    // Get locked prices
    const { PriceLock } = await import('../models');
    const lock = await PriceLock.findById(session.priceLockId);
    
    let items = cart.items;
    
    // Use locked prices if available
    if (lock && lock.status === 'active' && !lock.isExpired()) {
      items = cart.items.map((item) => {
        const lockedItem = lock.items.find(
          (li) => li.productId.toString() === item.productId.toString()
        );
        
        if (lockedItem) {
          return {
            ...item,
            currentPrice: lockedItem.lockedPrice,
          };
        }
        
        return item;
      });
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum, item) => sum + item.currentPrice * item.quantity,
      0
    );

    return {
      sessionId,
      items,
      subtotal,
      shipping: session.shippingCost,
      tax: session.tax,
      discount: session.discount,
      total: subtotal + session.shippingCost + session.tax - session.discount,
      priceLockExpiresAt: lock?.expiresAt,
      currentStep: session.currentStep,
    };
  }

  /**
   * Complete checkout (preparation for order)
   */
  async complete(sessionId: string, userId: string): Promise<any> {
    const session = await this.getSession(sessionId, userId);

    // Verify all steps completed
    if (session.currentStep !== CheckoutStep.REVIEW) {
      throw new BusinessError('Checkout not complete');
    }

    // Verify price lock
    const { PriceLock } = await import('../models');
    const lock = await PriceLock.findById(session.priceLockId);
    if (!lock || lock.status !== 'active' || lock.isExpired()) {
      throw new BusinessError('Price lock has expired');
    }

    // Update session status
    session.status = CheckoutStatus.COMPLETED;
    await session.save();

    // Update cart status
    const cart = await Cart.findById(session.cartId);
    if (cart) {
      cart.status = 'completed' as any;
      await cart.save();
    }

    // Emit event
    eventBus.emit('checkout.completed', {
      sessionId,
      userId,
      cartId: session.cartId,
      total: session.total,
    });

    logger.info('Checkout completed', {
      sessionId,
      userId,
      total: session.total,
    });

    return {
      sessionId,
      total: session.total,
      priceLockId: lock._id,
    };
  }

  /**
   * Cancel checkout
   */
  async cancel(sessionId: string, userId: string): Promise<void> {
    const session = await this.getSession(sessionId, userId);

    // Release price lock
    const { PriceLock } = await import('../models');
    await PriceLock.findByIdAndUpdate(session.priceLockId, {
      status: 'cancelled',
    });

    // Update session
    session.status = CheckoutStatus.ABANDONED;
    await session.save();

    // Update cart
    const cart = await Cart.findById(session.cartId);
    if (cart) {
      cart.status = 'active' as any;
      await cart.save();
    }

    logger.info('Checkout cancelled', { sessionId, userId });
  }
}

export const checkoutService = CheckoutService.getInstance();
export default checkoutService;
