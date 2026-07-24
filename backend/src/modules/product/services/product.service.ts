/**
 * Product Service
 * 
 * Business logic layer for products.
 */

import { productRepository } from '../repositories';
import { IProduct, CreateProductDTO, UpdateProductDTO, UpdateInventoryDTO, ProductFilters, ProductStatus } from '../interfaces';
import { pricingService } from '../../pricing/services';
import { cache } from '../../../database/cache';
import { eventBus, Events } from '../../../core/events';
import { NotFoundError, ValidationError, DuplicateError, BusinessError } from '../../../core/errors';
import { logger } from '../../../core/logger';

export class ProductService {
  private static instance: ProductService;
  private cachePrefix = 'product:';
  private cacheTTL = 300; // 5 minutes

  private constructor() {}

  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  /**
   * Get products with filters
   */
  async getProducts(storeId: string, filters: ProductFilters) {
    return productRepository.findByStore(storeId, filters);
  }

  /**
   * Get single product
   */
  async getProduct(id: string): Promise<IProduct> {
    const cacheKey = `${this.cachePrefix}${id}`;
    
    // Try cache
    const cached = await cache.get<IProduct>(cacheKey);
    if (cached) return cached;

    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product', id);
    }

    // Cache
    await cache.set(cacheKey, product, { ttl: this.cacheTTL });

    return product;
  }

  /**
   * Get product by slug
   */
  async getProductBySlug(slug: string, storeId: string): Promise<IProduct> {
    const product = await productRepository.findBySlug(slug, storeId);
    if (!product) {
      throw new NotFoundError('Product');
    }
    return product;
  }

  /**
   * Create product
   */
  async createProduct(data: CreateProductDTO, userId: string): Promise<IProduct> {
    // Validate SKU uniqueness
    const isSKUUnique = await productRepository.isSKUUnique(data.sku, data.storeId);
    if (!isSKUUnique) {
      throw new DuplicateError('SKU', data.sku);
    }

    // Create product
    const product = await productRepository.create({
      ...data,
      sellerId: userId,
      livePrice: data.basePrice,
      lastPriceUpdate: new Date(),
      stats: {
        viewCount: 0,
        orderCount: 0,
        favoriteCount: 0,
        averageRating: 0,
        reviewCount: 0,
      },
    } as any);

    // Emit event
    eventBus.emit(Events.PRODUCT_CREATED, { product, userId });

    logger.audit('Product created', userId, 'Product', product._id);

    return product;
  }

  /**
   * Update product
   */
  async updateProduct(id: string, data: UpdateProductDTO, userId: string): Promise<IProduct> {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product', id);
    }

    // Check ownership
    if (product.sellerId.toString() !== userId) {
      throw new BusinessError('You can only update your own products');
    }

    // Validate SKU if changed
    if (data.sku && data.sku !== product.sku) {
      const isSKUUnique = await productRepository.isSKUUnique(
        data.sku,
        product.storeId.toString(),
        id
      );
      if (!isSKUUnique) {
        throw new DuplicateError('SKU', data.sku);
      }
    }

    // Update product
    const updated = await productRepository.findByIdAndUpdate(id, {
      ...data,
      updatedBy: userId,
    });

    if (!updated) {
      throw new NotFoundError('Product', id);
    }

    // Invalidate cache
    await this.invalidateCache(id, product.storeId.toString());

    // Emit event
    eventBus.emit(Events.PRODUCT_UPDATED, { product: updated, userId });

    logger.audit('Product updated', userId, 'Product', id);

    return updated;
  }

  /**
   * Delete product (soft delete)
   */
  async deleteProduct(id: string, userId: string): Promise<void> {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product', id);
    }

    // Check ownership
    if (product.sellerId.toString() !== userId) {
      throw new BusinessError('You can only delete your own products');
    }

    // Soft delete
    await productRepository.deleteById(id, userId);

    // Invalidate cache
    await this.invalidateCache(id, product.storeId.toString());

    // Emit event
    eventBus.emit(Events.PRODUCT_DELETED, { productId: id, storeId: product.storeId });

    logger.audit('Product deleted', userId, 'Product', id);
  }

  /**
   * Publish product
   */
  async publishProduct(id: string, userId: string): Promise<IProduct> {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product', id);
    }

    // Check ownership
    if (product.sellerId.toString() !== userId) {
      throw new BusinessError('You can only publish your own products');
    }

    // Validate required fields
    if (!product.name || !product.sku || !product.categoryId) {
      throw new BusinessError('Product must have name, SKU, and category to publish');
    }

    // Update status
    const updated = await productRepository.findByIdAndUpdate(id, {
      status: ProductStatus.PUBLISHED,
      updatedBy: userId,
    });

    // Invalidate cache
    await this.invalidateCache(id, product.storeId.toString());

    // Emit event
    eventBus.emit(Events.PRODUCT_STATUS_CHANGED, {
      product: updated,
      oldStatus: product.status,
      newStatus: ProductStatus.PUBLISHED,
      userId,
    });

    logger.audit('Product published', userId, 'Product', id);

    return updated!;
  }

  /**
   * Archive product
   */
  async archiveProduct(id: string, userId: string): Promise<IProduct> {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product', id);
    }

    // Check ownership
    if (product.sellerId.toString() !== userId) {
      throw new BusinessError('You can only archive your own products');
    }

    // Update status
    const updated = await productRepository.findByIdAndUpdate(id, {
      status: ProductStatus.ARCHIVED,
      updatedBy: userId,
    });

    // Invalidate cache
    await this.invalidateCache(id, product.storeId.toString());

    // Emit event
    eventBus.emit(Events.PRODUCT_STATUS_CHANGED, {
      product: updated,
      oldStatus: product.status,
      newStatus: ProductStatus.ARCHIVED,
      userId,
    });

    logger.audit('Product archived', userId, 'Product', id);

    return updated!;
  }

  /**
   * Duplicate product
   */
  async duplicateProduct(id: string, userId: string): Promise<IProduct> {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product', id);
    }

    // Check ownership
    if (product.sellerId.toString() !== userId) {
      throw new BusinessError('You can only duplicate your own products');
    }

    // Create duplicate with new SKU
    const duplicateData: CreateProductDTO = {
      storeId: product.storeId.toString(),
      name: `${product.name} (Copy)`,
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      categoryId: product.categoryId.toString(),
      brandId: product.brandId?.toString(),
      tags: [...product.tags],
      priceType: product.priceType,
      basePrice: product.basePrice,
      currency: product.currency,
      sku: `${product.sku}-COPY-${Date.now()}`,
      barcode: product.barcode,
      currentStock: product.currentStock,
      minimumStock: product.minimumStock,
      trackInventory: product.trackInventory,
      weight: product.weight,
      weightUnit: product.weightUnit,
      dimensions: product.dimensions,
      status: ProductStatus.DRAFT,
      visibility: product.visibility,
      seo: { ...product.seo },
      specifications: [...product.specifications],
    };

    const duplicate = await this.createProduct(duplicateData, userId);

    logger.audit('Product duplicated', userId, 'Product', id, {
      duplicateId: duplicate._id,
    });

    return duplicate;
  }

  /**
   * Update inventory
   */
  async updateInventory(id: string, data: UpdateInventoryDTO, userId: string): Promise<IProduct> {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product', id);
    }

    // Check ownership
    if (product.sellerId.toString() !== userId) {
      throw new BusinessError('You can only update inventory for your own products');
    }

    // Validate
    if (data.currentStock !== undefined && data.currentStock < 0) {
      throw new ValidationError('Stock cannot be negative', []);
    }

    if (data.reservedStock !== undefined && data.reservedStock < 0) {
      throw new ValidationError('Reserved stock cannot be negative', []);
    }

    // Update inventory
    const updated = await productRepository.findByIdAndUpdate(id, {
      ...data,
      updatedBy: userId,
    });

    // Invalidate cache
    await this.invalidateCache(id, product.storeId.toString());

    // Check for low stock
    if (updated) {
      const available = updated.currentStock - updated.reservedStock;
      if (available <= updated.minimumStock && available > 0) {
        eventBus.emit(Events.INVENTORY_LOW, {
          productId: id,
          storeId: product.storeId,
          available,
          minimum: updated.minimumStock,
        });
      } else if (available <= 0) {
        eventBus.emit(Events.INVENTORY_OUT, {
          productId: id,
          storeId: product.storeId,
        });
      }
    }

    logger.audit('Inventory updated', userId, 'Product', id, data);

    return updated!;
  }

  /**
   * Reserve stock
   */
  async reserveStock(id: string, quantity: number): Promise<boolean> {
    const product = await productRepository.findById(id);
    if (!product) {
      return false;
    }

    const available = product.currentStock - product.reservedStock;
    if (available < quantity) {
      return false;
    }

    await productRepository.findByIdAndUpdate(id, {
      $inc: { reservedStock: quantity },
    });

    return true;
  }

  /**
   * Release stock
   */
  async releaseStock(id: string, quantity: number): Promise<void> {
    await productRepository.findByIdAndUpdate(id, {
      $inc: { reservedStock: -quantity },
    });
  }

  /**
   * Search products
   */
  async searchProducts(query: string, storeId: string): Promise<IProduct[]> {
    return productRepository.searchProducts(query, storeId);
  }

  /**
   * Get product with live price
   */
  async getProductWithPrice(id: string, currency = 'USD') {
    const product = await this.getProduct(id);
    
    // Get live price from pricing engine
    const price = await pricingService.calculatePrice({
      productId: id,
      storeId: product.storeId.toString(),
      basePrice: product.basePrice,
      currency: product.currency,
      targetCurrency: currency,
    });

    return {
      ...product,
      livePrice: price.finalPrice,
      formattedPrice: price.formattedPrice,
      priceComponents: price.components,
    };
  }

  /**
   * Get status counts
   */
  async getStatusCounts(storeId: string) {
    return productRepository.getStatusCounts(storeId);
  }

  /**
   * Get stock summary
   */
  async getStockSummary(storeId: string) {
    return productRepository.getStockSummary(storeId);
  }

  /**
   * Bulk operations
   */
  async bulkDelete(productIds: string[], storeId: string, userId: string) {
    // Verify ownership
    for (const id of productIds) {
      const product = await productRepository.findById(id);
      if (!product || product.sellerId.toString() !== userId) {
        throw new BusinessError(`Cannot delete product ${id}`);
      }
    }

    const result = await productRepository.bulkUpdate(productIds, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userId,
    });

    // Invalidate caches
    for (const id of productIds) {
      await this.invalidateCache(id, storeId);
    }

    logger.audit('Bulk products deleted', userId, 'Product', undefined, {
      productIds,
      count: result.modifiedCount,
    });

    return result;
  }

  async bulkPublish(productIds: string[], storeId: string, userId: string) {
    const result = await productRepository.bulkUpdate(productIds, {
      status: ProductStatus.PUBLISHED,
      updatedBy: userId,
    });

    for (const id of productIds) {
      await this.invalidateCache(id, storeId);
    }

    logger.audit('Bulk products published', userId, 'Product', undefined, {
      productIds,
      count: result.modifiedCount,
    });

    return result;
  }

  async bulkArchive(productIds: string[], storeId: string, userId: string) {
    const result = await productRepository.bulkUpdate(productIds, {
      status: ProductStatus.ARCHIVED,
      updatedBy: userId,
    });

    for (const id of productIds) {
      await this.invalidateCache(id, storeId);
    }

    logger.audit('Bulk products archived', userId, 'Product', undefined, {
      productIds,
      count: result.modifiedCount,
    });

    return result;
  }

  /**
   * Invalidate cache
   */
  private async invalidateCache(productId: string, storeId: string): Promise<void> {
    await cache.del(`${this.cachePrefix}${productId}`);
    await cache.delByPattern(`${this.cachePrefix}store:${storeId}:*`);
  }
}

export const productService = ProductService.getInstance();
export default productService;
