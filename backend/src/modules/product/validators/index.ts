/**
 * Product Validators
 * 
 * Zod schemas for request validation.
 */

import { z } from 'zod';

// ===========================================
// CREATE PRODUCT
// ===========================================

export const createProductSchema = z.object({
  // Basic Info
  name: z.string().min(3).max(200).trim(),
  shortDescription: z.string().max(500).optional(),
  fullDescription: z.string().max(10000).optional(),
  
  // Categorization
  categoryId: z.string().min(1),
  brandId: z.string().optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  
  // Pricing
  priceType: z.enum(['static', 'dynamic']),
  basePrice: z.number().min(0),
  currency: z.string().length(3).optional(),
  
  // Inventory
  sku: z.string().min(1).max(50).trim(),
  barcode: z.string().max(100).optional(),
  currentStock: z.number().int().min(0).optional(),
  minimumStock: z.number().int().min(0).optional(),
  trackInventory: z.boolean().optional(),
  
  // Physical
  weight: z.number().min(0).optional(),
  weightUnit: z.enum(['kg', 'g', 'lb', 'oz']).optional(),
  dimensions: z.object({
    length: z.number().min(0).optional(),
    width: z.number().min(0).optional(),
    height: z.number().min(0).optional(),
    unit: z.enum(['cm', 'in', 'mm']).optional(),
  }).optional(),
  
  // Status
  status: z.enum(['draft', 'pending_review', 'published', 'hidden', 'archived']).optional(),
  visibility: z.enum(['public', 'private', 'hidden']).optional(),
  
  // SEO
  seo: z.object({
    title: z.string().max(70).optional(),
    description: z.string().max(170).optional(),
    keywords: z.array(z.string().max(50)).max(10).optional(),
  }).optional(),
  
  // Specifications
  specifications: z.array(z.object({
    key: z.string().max(100),
    value: z.string().max(500),
  })).max(50).optional(),
  
  // Metadata
  metadata: z.record(z.any()).optional(),
});

// ===========================================
// UPDATE PRODUCT
// ===========================================

export const updateProductSchema = createProductSchema.partial().omit({ sku: true });

// ===========================================
// UPDATE INVENTORY
// ===========================================

export const updateInventorySchema = z.object({
  currentStock: z.number().int().min(0).optional(),
  minimumStock: z.number().int().min(0).optional(),
  reservedStock: z.number().int().min(0).optional(),
  trackInventory: z.boolean().optional(),
});

// ===========================================
// BULK OPERATIONS
// ===========================================

export const bulkOperationSchema = z.object({
  productIds: z.array(z.string()).min(1).max(100),
});

// ===========================================
// PRODUCT FILTERS
// ===========================================

export const productFiltersSchema = z.object({
  page: z.string().optional().transform(Number).default('1'),
  limit: z.string().optional().transform(Number).default('10'),
  status: z.string().optional(),
  visibility: z.enum(['public', 'private', 'hidden']).optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  priceType: z.enum(['static', 'dynamic']).optional(),
  stockStatus: z.enum(['in_stock', 'low_stock', 'out_of_stock']).optional(),
  minPrice: z.string().optional().transform(Number),
  maxPrice: z.string().optional().transform(Number),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// ===========================================
// PRODUCT QUERY
// ===========================================

export const productQuerySchema = z.object({
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});
