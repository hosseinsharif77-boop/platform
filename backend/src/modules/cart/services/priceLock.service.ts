/**
 * Price Lock Service
 * 
 * Manages price locking during checkout.
 */

import { PriceLock, IPriceLock } from '../models';
import { Cart } from '../models';
import { PriceLockStatus, PriceLockItem } from '../interfaces';
import { cache } from '../../../database/cache';
import { eventBus, Events } from '../../../core/events';
import { NotFoundError, BusinessError } from '../../../core/errors';
import { logger } from '../../../core/logger';

export class PriceLockService {
  private static instance: PriceLockService;
  private defaultDuration = 15; // 15 minutes
  private cachePrefix = 'price_lock:';
  private cacheTTL = 900; // 15 minutes

  private constructor() {}

  static getInstance(): PriceLockService {
    if (!PriceLockService.instance) {
      PriceLockService.instance = new PriceLockService();
    }
    return PriceLockService.instance;
  }

  /**
   * Create price lock for cart items
   */
  async createLock(userId: string, cartId: string): Promise<IPriceLock> {
    // Get cart
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new NotFoundError('Cart', cartId);
    }

    // Verify ownership
    if (cart.userId?.toString() !== userId) {
      throw new BusinessError('Unauthorized');
    }

    // Check for existing active lock
    const existingLock = await PriceLock.findActiveByUser(userId);
    if (existingLock) {
      // Release old lock
      existingLock.status = PriceLockStatus.CANCELLED;
      await existingLock.save();
    }

    // Create lock items
    const lockItems: PriceLockItem[] = cart.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      lockedPrice: item.currentPrice,
      originalPrice: item.unitPrice,
    }));

    // Calculate expiration
    const lockedAt = new Date();
    const expiresAt = new Date(lockedAt.getTime() + this.defaultDuration * 60 * 1000);

    // Create lock
    const lock = await PriceLock.create({
      userId,
      sessionId: cart.sessionId,
      items: lockItems,
      lockedAt,
      expiresAt,
      durationMinutes: this.defaultDuration,
      status: PriceLockStatus.ACTIVE,
    });

    // Update cart status
    cart.status = 'checkout' as any;
    await cart.save();

    // Cache lock
    await cache.set(`${this.cachePrefix}${lock._id}`, lock, { ttl: this.cacheTTL });

    // Emit event
    eventBus.emit(Events.PRICE_LOCKED, {
      lockId: lock._id,
      userId,
      itemCount: lockItems.length,
      expiresAt,
    });

    logger.info('Price lock created', {
      lockId: lock._id,
      userId,
      itemCount: lockItems.length,
      expiresAt,
    });

    return lock;
  }

  /**
   * Get active lock for user
   */
  async getActiveLock(userId: string): Promise<IPriceLock | null> {
    return PriceLock.findActiveByUser(userId);
  }

  /**
   * Verify locked price
   */
  async verifyLockedPrice(
    lockId: string,
    productId: string,
    expectedPrice: number
  ): Promise<boolean> {
    const lock = await PriceLock.findById(lockId);
    if (!lock || lock.status !== PriceLockStatus.ACTIVE) {
      return false;
    }

    // Check expiration
    if (lock.isExpired()) {
      lock.status = PriceLockStatus.EXPIRED;
      await lock.save();
      return false;
    }

    // Find item
    const item = lock.items.find(
      (i) => i.productId.toString() === productId
    );

    if (!item) {
      return false;
    }

    return item.lockedPrice === expectedPrice;
  }

  /**
   * Release price lock
   */
  async releaseLock(lockId: string, userId: string): Promise<void> {
    const lock = await PriceLock.findById(lockId);
    if (!lock) {
      throw new NotFoundError('Price lock', lockId);
    }

    if (lock.userId.toString() !== userId) {
      throw new BusinessError('Unauthorized');
    }

    lock.status = PriceLockStatus.CANCELLED;
    await lock.save();

    // Remove from cache
    await cache.del(`${this.cachePrefix}${lockId}`);

    // Emit event
    eventBus.emit('price.lock.released', {
      lockId,
      userId,
    });

    logger.info('Price lock released', { lockId, userId });
  }

  /**
   * Complete price lock (after order creation)
   */
  async completeLock(lockId: string, orderId: string): Promise<void> {
    const lock = await PriceLock.findById(lockId);
    if (!lock) {
      throw new NotFoundError('Price lock', lockId);
    }

    lock.status = PriceLockStatus.COMPLETED;
    lock.orderId = orderId;
    await lock.save();

    // Remove from cache
    await cache.del(`${this.cachePrefix}${lockId}`);

    logger.info('Price lock completed', { lockId, orderId });
  }

  /**
   * Cleanup expired locks
   */
  async cleanupExpiredLocks(): Promise<number> {
    const count = await PriceLock.cleanupExpired();
    
    if (count > 0) {
      logger.info(`Cleaned up ${count} expired price locks`);
      
      eventBus.emit('price.lock.expired', { count });
    }
    
    return count;
  }

  /**
   * Get lock time remaining
   */
  async getTimeRemaining(lockId: string): Promise<number> {
    const lock = await PriceLock.findById(lockId);
    if (!lock) {
      return 0;
    }
    return lock.getTimeRemaining();
  }

  /**
   * Validate lock is still valid
   */
  async isLockValid(lockId: string): Promise<boolean> {
    const lock = await PriceLock.findById(lockId);
    if (!lock || lock.status !== PriceLockStatus.ACTIVE) {
      return false;
    }
    return !lock.isExpired();
  }
}

export const priceLockService = PriceLockService.getInstance();
export default priceLockService;
