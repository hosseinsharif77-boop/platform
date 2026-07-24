/**
 * Base Repository
 * 
 * Generic repository pattern for database operations.
 * Provides CRUD operations with pagination and filtering.
 */

import { Model, Document, QueryOptions, FilterQuery } from 'mongoose';
import { logger } from '../utils/logger';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Find a document by ID
   */
  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      logger.error(`Error finding ${this.model.modelName} by id:`, error);
      throw error;
    }
  }

  /**
   * Find documents by query
   */
  async find(query: FilterQuery<T> = {}, options?: QueryOptions): Promise<T[]> {
    try {
      return await this.model.find(query, null, options);
    } catch (error) {
      logger.error(`Error finding ${this.model.modelName} documents:`, error);
      throw error;
    }
  }

  /**
   * Find one document by query
   */
  async findOne(query: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(query);
    } catch (error) {
      logger.error(`Error finding ${this.model.modelName} document:`, error);
      throw error;
    }
  }

  /**
   * Create a new document
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      logger.error(`Error creating ${this.model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Update a document by ID
   */
  async findByIdAndUpdate(id: string, data: Partial<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    } catch (error) {
      logger.error(`Error updating ${this.model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a document by ID
   */
  async findByIdAndDelete(id: string): Promise<T | null> {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      logger.error(`Error deleting ${this.model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Count documents
   */
  async countDocuments(query: FilterQuery<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(query);
    } catch (error) {
      logger.error(`Error counting ${this.model.modelName} documents:`, error);
      throw error;
    }
  }

  /**
   * Find documents with pagination
   */
  async findPaginated(
    query: FilterQuery<T> = {},
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<T>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;

    try {
      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 } as any;

      const [data, totalCount] = await Promise.all([
        this.model.find(query).sort(sort).skip(skip).limit(limit),
        this.model.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        data,
        totalCount,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      logger.error(`Error finding paginated ${this.model.modelName}:`, error);
      throw error;
    }
  }
}
