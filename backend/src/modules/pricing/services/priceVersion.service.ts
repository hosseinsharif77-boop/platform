/**
 * Price Version Service
 * 
 * Manages price versions and rollback functionality.
 */

import { PriceVersion } from '../models';
import { cache } from '../../../database/cache';
import { eventBus, Events } from '../../../core/events';
import { logger } from '../../../core/logger';
import { NotFoundError, BusinessError } from '../../../core/errors';

export class PriceVersionService {
  private static instance: PriceVersionService;
  private cachePrefix = 'price_version:';
  private cacheTTL = 300; // 5 minutes

  private constructor() {}

  static getInstance(): PriceVersionService {
    if (!PriceVersionService.instance) {
      PriceVersionService.instance = new PriceVersionService();
    }
    return PriceVersionService.instance;
  }

  /**
   * Create new price version
   */
  async createVersion(data: {
    productId: string;
    storeId: string;
    price: number;
    currency: string;
    basePrice: number;
    exchangeRate: number;
    appliedRules?: string[];
    createdBy: string;
    metadata?: Record<string, any>;
  }): Promise<any> {
    // Get next version number
    const nextVersion = await PriceVersion.getNextVersion(data.productId);
    
    // Get current active version
    const currentVersion = await PriceVersion.getLatestVersion(data.productId);
    
    // Deactivate current version
    if (currentVersion) {
      await PriceVersion.findByIdAndUpdate(currentVersion._id, {
        isActive: false,
      });
    }

    // Create new version
    const version = await PriceVersion.create({
      ...data,
      version: nextVersion,
      previousVersion: currentVersion?.version,
      canRollback: true,
      isActive: true,
    });

    // Invalidate cache
    await this.invalidateCache(data.productId);

    // Emit event
    eventBus.emit(Events.PRICE_UPDATED, {
      productId: data.productId,
      storeId: data.storeId,
      version: nextVersion,
    });

    logger.audit(
      'Price version created',
      data.createdBy,
      'Product',
      data.productId,
      { version: nextVersion, price: data.price }
    );

    return version;
  }

  /**
   * Get latest version
   */
  async getLatestVersion(productId: string): Promise<any | null> {
    const cacheKey = `${this.cachePrefix}${productId}:latest`;
    
    const cached = await cache.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    const version = await PriceVersion.getLatestVersion(productId);
    if (version) {
      await cache.set(cacheKey, version, { ttl: this.cacheTTL });
    }
    
    return version;
  }

  /**
   * Get specific version
   */
  async getVersion(productId: string, version: number): Promise<any | null> {
    return PriceVersion.getVersion(productId, version);
  }

  /**
   * Get all versions
   */
  async getAllVersions(productId: string): Promise<any[]> {
    return PriceVersion.getAllVersions(productId);
  }

  /**
   * Rollback to previous version
   */
  async rollback(
    productId: string,
    storeId: string,
    targetVersion: number,
    userId: string,
    reason?: string
  ): Promise<any> {
    const currentVersion = await PriceVersion.getLatestVersion(productId);
    
    if (!currentVersion) {
      throw new NotFoundError('Price version');
    }

    if (currentVersion.version === targetVersion) {
      throw new BusinessError('Cannot rollback to current version');
    }

    // Get target version
    const target = await PriceVersion.getVersion(productId, targetVersion);
    
    if (!target) {
      throw new NotFoundError('Price version', targetVersion.toString());
    }

    // Create rollback version
    const rollbackVersion = await this.createVersion({
      productId,
      storeId,
      price: target.price,
      currency: target.currency,
      basePrice: target.basePrice,
      exchangeRate: target.exchangeRate,
      appliedRules: target.appliedRules,
      createdBy: userId,
      metadata: {
        rollback: true,
        rollbackFrom: currentVersion.version,
        rollbackTo: targetVersion,
        reason,
      },
    });

    // Emit event
    eventBus.emit(Events.PRICE_UPDATED, {
      productId,
      storeId,
      version: rollbackVersion.version,
      rollback: true,
      rollbackFrom: currentVersion.version,
      rollbackTo: targetVersion,
    });

    logger.audit(
      'Price rollback completed',
      userId,
      'Product',
      productId,
      {
        from: currentVersion.version,
        to: targetVersion,
        reason,
      }
    );

    return rollbackVersion;
  }

  /**
   * Invalidate cache
   */
  private async invalidateCache(productId: string): Promise<void> {
    await cache.del(`${this.cachePrefix}${productId}:latest`);
  }
}

export const priceVersionService = PriceVersionService.getInstance();
export default priceVersionService;
