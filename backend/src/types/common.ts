/**
 * Common Types
 * 
 * Shared TypeScript types.
 */

export interface PaginationParams {
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
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface QueryOptions {
  populate?: string | string[];
  select?: string;
  lean?: boolean;
}

export interface FindOptions extends PaginationParams, QueryOptions {
  filter?: Record<string, any>;
}

export interface BaseEntity {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditFields {
  createdBy?: string;
  updatedBy?: string;
}

export interface SoftDeleteFields {
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface StoreScoped {
  storeId: string;
}

export interface UserScoped {
  userId: string;
}
