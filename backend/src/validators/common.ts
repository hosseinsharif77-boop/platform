/**
 * Validation Schemas
 * 
 * Common validation schemas using Zod.
 */

import { z } from 'zod';

/**
 * Pagination query schema
 */
export const paginationSchema = z.object({
  page: z.string().optional().transform(Number).default('1'),
  limit: z.string().optional().transform(Number).default('10'),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * ID parameter schema
 */
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

/**
 * Email schema
 */
export const emailSchema = z.string().email('Invalid email address');

/**
 * Password schema
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Search query schema
 */
export const searchQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  page: z.string().optional().transform(Number).default('1'),
  limit: z.string().optional().transform(Number).default('10'),
});
