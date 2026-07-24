/**
 * Product Routes
 * 
 * API routes for product operations.
 */

import { Router } from 'express';
import { productController } from '../controllers';
import { authenticate, authorize, validate } from '../../../middlewares';
import {
  createProductSchema,
  updateProductSchema,
  updateInventorySchema,
  bulkOperationSchema,
  productFiltersSchema,
} from '../validators';

const router = Router();

// ===========================================
// PRODUCT CRUD
// ===========================================

router.get(
  '/',
  authenticate,
  productController.getProducts
);

router.get(
  '/search',
  authenticate,
  productController.searchProducts
);

router.get(
  '/stats/status',
  authenticate,
  productController.getStatusCounts
);

router.get(
  '/stats/stock',
  authenticate,
  productController.getStockSummary
);

router.get(
  '/:id',
  authenticate,
  productController.getProduct
);

router.post(
  '/',
  authenticate,
  authorize('vendor', 'admin'),
  validate(createProductSchema),
  productController.createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize('vendor', 'admin'),
  validate(updateProductSchema),
  productController.updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize('vendor', 'admin'),
  productController.deleteProduct
);

// ===========================================
// PRODUCT OPERATIONS
// ===========================================

router.post(
  '/:id/publish',
  authenticate,
  authorize('vendor', 'admin'),
  productController.publishProduct
);

router.post(
  '/:id/archive',
  authenticate,
  authorize('vendor', 'admin'),
  productController.archiveProduct
);

router.post(
  '/:id/duplicate',
  authenticate,
  authorize('vendor', 'admin'),
  productController.duplicateProduct
);

// ===========================================
// INVENTORY
// ===========================================

router.put(
  '/:id/inventory',
  authenticate,
  authorize('vendor', 'admin'),
  validate(updateInventorySchema),
  productController.updateInventory
);

// ===========================================
// BULK OPERATIONS
// ===========================================

router.post(
  '/bulk/delete',
  authenticate,
  authorize('vendor', 'admin'),
  validate(bulkOperationSchema),
  productController.bulkDelete
);

router.post(
  '/bulk/publish',
  authenticate,
  authorize('vendor', 'admin'),
  validate(bulkOperationSchema),
  productController.bulkPublish
);

router.post(
  '/bulk/archive',
  authenticate,
  authorize('vendor', 'admin'),
  validate(bulkOperationSchema),
  productController.bulkArchive
);

export default router;
