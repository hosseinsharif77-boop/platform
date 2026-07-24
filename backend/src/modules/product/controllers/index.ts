/**
 * Product Controller
 * 
 * Handles HTTP requests for product operations.
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../middlewares';
import { productService } from '../services';
import { sendSuccess, sendPaginated } from '../../../utils/response';
import { parsePagination, parseSort } from '../../../utils/helpers';

class ProductController {
  private static instance: ProductController;

  private constructor() {}

  static getInstance(): ProductController {
    if (!ProductController.instance) {
      ProductController.instance = new ProductController();
    }
    return ProductController.instance;
  }

  /**
   * List products
   */
  getProducts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const storeId = req.storeId || req.user!.id;
      const {
        page = '1',
        limit = '10',
        status,
        visibility,
        categoryId,
        brandId,
        priceType,
        stockStatus,
        minPrice,
        maxPrice,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query;

      const filters = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        status: status as any,
        visibility: visibility as any,
        categoryId: categoryId as string,
        brandId: brandId as string,
        priceType: priceType as any,
        stockStatus: stockStatus as any,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        search: search as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      };

      const result = await productService.getProducts(storeId, filters);

      sendPaginated(
        res,
        result.products,
        result.total,
        result.page,
        result.limit,
        'Products retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get single product
   */
  getProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { currency } = req.query;

      const product = await productService.getProductWithPrice(
        id,
        currency as string
      );

      sendSuccess(res, product, 'Product retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create product
   */
  createProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const storeId = req.storeId || req.user!.id;

      const product = await productService.createProduct(
        { ...req.body, storeId },
        userId
      );

      sendSuccess(res, product, 'Product created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update product
   */
  updateProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const product = await productService.updateProduct(id, req.body, userId);

      sendSuccess(res, product, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete product
   */
  deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      await productService.deleteProduct(id, userId);

      sendSuccess(res, null, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Publish product
   */
  publishProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const product = await productService.publishProduct(id, userId);

      sendSuccess(res, product, 'Product published successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Archive product
   */
  archiveProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const product = await productService.archiveProduct(id, userId);

      sendSuccess(res, product, 'Product archived successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Duplicate product
   */
  duplicateProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const product = await productService.duplicateProduct(id, userId);

      sendSuccess(res, product, 'Product duplicated successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update inventory
   */
  updateInventory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const product = await productService.updateInventory(id, req.body, userId);

      sendSuccess(res, product, 'Inventory updated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Search products
   */
  searchProducts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const storeId = req.storeId || req.user!.id;
      const { q } = req.query;

      const products = await productService.searchProducts(q as string, storeId);

      sendSuccess(res, products, 'Search completed successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get status counts
   */
  getStatusCounts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const storeId = req.storeId || req.user!.id;

      const counts = await productService.getStatusCounts(storeId);

      sendSuccess(res, counts, 'Status counts retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get stock summary
   */
  getStockSummary = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const storeId = req.storeId || req.user!.id;

      const summary = await productService.getStockSummary(storeId);

      sendSuccess(res, summary, 'Stock summary retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Bulk delete
   */
  bulkDelete = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { productIds } = req.body;
      const storeId = req.storeId || req.user!.id;
      const userId = req.user!.id;

      const result = await productService.bulkDelete(productIds, storeId, userId);

      sendSuccess(res, result, 'Bulk delete completed successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Bulk publish
   */
  bulkPublish = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { productIds } = req.body;
      const storeId = req.storeId || req.user!.id;
      const userId = req.user!.id;

      const result = await productService.bulkPublish(productIds, storeId, userId);

      sendSuccess(res, result, 'Bulk publish completed successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Bulk archive
   */
  bulkArchive = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { productIds } = req.body;
      const storeId = req.storeId || req.user!.id;
      const userId = req.user!.id;

      const result = await productService.bulkArchive(productIds, storeId, userId);

      sendSuccess(res, result, 'Bulk archive completed successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const productController = ProductController.getInstance();
export default productController;
