/**
 * Product Repository
 * 
 * Data access layer for products.
 */

import { Product, IProduct } from '../models';
import { ProductFilters, ProductStatus, ProductVisibility } from '../interfaces';
import { BaseRepository } from '../../../repositories/baseRepository';
import { logger } from '../../../core/logger';

export class ProductRepository extends BaseRepository<IProduct> {
  private static instance: ProductRepository;

  private constructor() {
    super(Product);
  }

  static getInstance(): ProductRepository {
    if (!ProductRepository.instance) {
      ProductRepository.instance = new ProductRepository();
    }
    return ProductRepository.instance;
  }

  /**
   * Find product by slug
   */
  async findBySlug(slug: string, storeId: string): Promise<IProduct | null> {
    return Product.findBySlug(slug, storeId);
  }

  /**
   * Find product by SKU
   */
  async findBySKU(sku: string, storeId: string): Promise<IProduct | null> {
    return Product.findBySKU(sku, storeId);
  }

  /**
   * Find products by store with filters
   */
  async findByStore(storeId: string, filters: ProductFilters = {}): Promise<{
    products: IProduct[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const {
      status,
      visibility,
      categoryId,
      brandId,
      priceType,
      stockStatus,
      minPrice,
      maxPrice,
      tags,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = filters;

    // Build query
    const query: any = { storeId, isDeleted: false };

    // Status filter
    if (status) {
      query.status = Array.isArray(status) ? { $in: status } : status;
    }

    // Visibility filter
    if (visibility) {
      query.visibility = visibility;
    }

    // Category filter
    if (categoryId) {
      query.categoryId = categoryId;
    }

    // Brand filter
    if (brandId) {
      query.brandId = brandId;
    }

    // Price type filter
    if (priceType) {
      query.priceType = priceType;
    }

    // Stock status filter
    if (stockStatus) {
      switch (stockStatus) {
        case 'out_of_stock':
          query.$expr = { $lte: ['$currentStock', '$reservedStock'] };
          break;
        case 'low_stock':
          query.$expr = {
            $and: [
              { $gt: [{ $subtract: ['$currentStock', '$reservedStock'] }, 0] },
              { $lte: [{ $subtract: ['$currentStock', '$reservedStock'] }, '$minimumStock'] },
            ],
          };
          break;
        case 'in_stock':
          query.$expr = { $gt: [{ $subtract: ['$currentStock', '$reservedStock'] }, '$minimumStock'] };
          break;
      }
    }

    // Price range filter
    if (minPrice !== undefined) {
      query.basePrice = { ...query.basePrice, $gte: minPrice };
    }
    if (maxPrice !== undefined) {
      query.basePrice = { ...query.basePrice, $lte: maxPrice };
    }

    // Tags filter
    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Execute queries
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('categoryId', 'name slug')
        .populate('brandId', 'name slug')
        .lean(),
      Product.countDocuments(query),
    ]);

    const pages = Math.ceil(total / limit);

    return {
      products,
      total,
      page,
      limit,
      pages,
    };
  }

  /**
   * Search products
   */
  async searchProducts(query: string, storeId: string): Promise<IProduct[]> {
    return Product.searchProducts(query, storeId);
  }

  /**
   * Check SKU uniqueness
   */
  async isSKUUnique(sku: string, storeId: string, excludeId?: string): Promise<boolean> {
    const query: any = { sku: sku.toUpperCase(), storeId, isDeleted: false };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const count = await Product.countDocuments(query);
    return count === 0;
  }

  /**
   * Check slug uniqueness
   */
  async isSlugUnique(slug: string, storeId: string, excludeId?: string): Promise<boolean> {
    const query: any = { slug, storeId, isDeleted: false };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const count = await Product.countDocuments(query);
    return count === 0;
  }

  /**
   * Get product counts by status
   */
  async getStatusCounts(storeId: string): Promise<Record<ProductStatus, number>> {
    const counts = await Product.aggregate([
      { $match: { storeId: Product.toObjectId(storeId), isDeleted: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const result: any = {};
    for (const count of counts) {
      result[count._id] = count.count;
    }
    return result;
  }

  /**
   * Get stock summary
   */
  async getStockSummary(storeId: string): Promise<{
    totalProducts: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
  }> {
    const summary = await Product.aggregate([
      { $match: { storeId: Product.toObjectId(storeId), isDeleted: false, trackInventory: true } },
      {
        $addFields: {
          availableStock: { $subtract: ['$currentStock', '$reservedStock'] },
        },
      },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          inStock: {
            $sum: {
              $cond: [{ $gt: ['$availableStock', '$minimumStock'] }, 1, 0],
            },
          },
          lowStock: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: ['$availableStock', 0] },
                    { $lte: ['$availableStock', '$minimumStock'] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          outOfStock: {
            $sum: {
              $cond: [{ $lte: ['$availableStock', 0] }, 1, 0],
            },
          },
        },
      },
    ]);

    return summary[0] || {
      totalProducts: 0,
      inStock: 0,
      lowStock: 0,
      outOfStock: 0,
    };
  }

  /**
   * Bulk update products
   */
  async bulkUpdate(
    productIds: string[],
    update: any
  ): Promise<{ modifiedCount: number }> {
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      update
    );
    return { modifiedCount: result.modifiedCount };
  }

  /**
   * Increment stats
   */
  async incrementStats(
    productId: string,
    field: keyof IProduct['stats'],
    amount = 1
  ): Promise<void> {
    await Product.findByIdAndUpdate(productId, {
      $inc: { [`stats.${field}`]: amount },
    });
  }
}

export const productRepository = ProductRepository.getInstance();
export default productRepository;
