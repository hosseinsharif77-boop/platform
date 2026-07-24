/**
 * Price Lock Service
 * 
 * Manages price locks for checkout process.
 */

import { PriceLock } from '../models';
import { cache } from '../../../database/cache';
import { eventBus, Events } from '../../../core/events';
import { logger } from '../../../core/logger';
import { NotFoundError, BusinessError } from '../../../core/errors';

export class PriceLockService {
  private static instance: PriceLockService;
  private defaultLockDuration = 15; // 15 minutes
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
   * Create price lock
   */
  async createLock(data: {
    productId: string;
    storeId: string;
    variantId?: string;
    userId: string;
    lockedPrice: number;
    currency: string;
    durationMinutes?: number;
  }): Promise<any> {
    const duration = data.durationMinutes || this.defaultLockDuration;
    const expiresAt = new Date(Date.now() + duration * 60 * 1000);

    // Check for existing active lock
    const existingLock = await PriceLock.findOne({
      productId: data.productId,
      userId: data.userId,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (existingLock) {
      // Update existing lock
      existingLock.lockedPrice = data.lockedPrice;
      existingLock.expiresAt = expiresAt;
      await existingLock.save();
      
      return existingLock;
    }

    // Create new lock
    const lock = await PriceLock.create({
      ...data,
      expiresAt,
      isActive: true,
    });

    // Cache the lock
    const cacheKey = `${this.cachePrefix}${data.productId}:${data.userId}`;
    await cache.set(cacheKey, lock, { ttl: this.cacheTTL });

    // Emit event
    eventBus.emit(Events.PRICE_LOCKED, {
      productId: data.productId,
      userId: data.userId,
      lockedPrice: data.lockedPrice,
      expiresAt,
    });

    logger.info('Price locked', {
      productId: data.productId,
      userId: data.userId,
      price: data.lockedPrice,
      expiresAt,
    });

    return lock;
  }

  /**
   * Verify price lock
   */
  async verifyLock(
    productId: string,
    userId: string,
    expectedPrice: number
  ): Promise<boolean> {
    const lock = await PriceLock.findOne({
      productId,
      userId,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!lock) {
      return false;
    }

    return lock.lockedPrice === expectedPrice;
  }

  /**
   * Release price lock
   */
  async releaseLock(lockId: string, userId?: string): Promise<void> {
    const query: any = { _id: lockId };
    if (userId) {
      query.userId = userId;
    }

    const lock = await PriceLock.findOneAndUpdate(
      query,
      { isActive: false },
      { new: true }
    );

    if (!lock) {
      throw new NotFoundError('Price lock', lockId);
    }

    // Remove from cache
    const cacheKey = `${this.cachePrefix}${lock.productId}:${lock.userId}`;
    await cache.del(cacheKey);

    logger.info('Price lock released', { lockId });
  }

  /**
   * Release all locks for a user
   */
  async releaseAllUserLocks(userId: string): Promise<void> {
    await PriceLock.updateMany(
      { userId, isActive: true },
      { isActive: false }
    );

    logger.info('All price locks released for user', { userId });
  }

  /**
   * Cleanup expired locks
   */
  async cleanupExpiredLocks(): Promise<number> {
    const count = await PriceLock.cleanupExpired();
    
    if (count > 0) {
      logger.info(`Cleaned up ${count} expired price locks`);
      
      // Emit event for expired locks
      eventBus.emit(Events.PRICE_EXPIRED, { count });
    }
    
    return count;
  }

  /**
   * Get active locks for a product
   */
  async getActiveLocks(productId: string): Promise<any[]> {
    return PriceLock.findActiveByProduct(productId);
  }

  /**
   * Get active locks for a user
   */
  async getUserLocks(userId: string): Promise<any[]> {
    return PriceLock.findActiveByUser(userId);
  }

  /**
   * Check if product is locked by user
   */
  async isProductLocked(productId: string, userId: string): Promise<boolean> {
    const lock = await PriceLock.findOne({
      productId,
      userId,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    return !!lock;
  }

  /**
   * Get lock info
   */
  async getLockInfo(productId: string, userId: string): Promise<any | null> {
    const cacheKey = `${this.cachePrefix}${productId}:${userId}`;
    
    const cached = await cache.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    const lock = await PriceLock.findOne({
      productId,
      userId,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (lock) {
      await cache.set(cacheKey, lock, { ttl: this.cacheTTL });
    }

    return lock;
  }
}

export const priceLockService = PriceLockService.getInstance();
export default priceLockService;
