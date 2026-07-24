/**
 * Pagination Plugin
 * 
 * Adds pagination capabilities to Mongoose models.
 */

import { Schema, Document, Query } from 'mongoose';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Pagination plugin adds paginated query method
 */
export function paginationPlugin(schema: Schema): void {
  // Static method for paginated queries
  schema.statics.paginate = async function (
    filter: any = {},
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<any>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Execute queries in parallel
    const [data, totalCount] = await Promise.all([
      this.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      this.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  };
}

export default paginationPlugin;
