/**
 * Base Service
 * 
 * Generic service layer for business logic.
 * Provides common operations and validation.
 */

import { BaseRepository, PaginatedResult, PaginationOptions } from '../repositories/baseRepository';
import { ApiError } from '../middlewares/errorHandler';
import { Document } from 'mongoose';

export class BaseService<T extends Document> {
  protected repository: BaseRepository<T>;
  protected modelName: string;

  constructor(repository: BaseRepository<T>, modelName: string) {
    this.repository = repository;
    this.modelName = modelName;
  }

  /**
   * Get all documents with pagination
   */
  async getAll(
    query: any = {},
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<T>> {
    return this.repository.findPaginated(query, options);
  }

  /**
   * Get document by ID
   */
  async getById(id: string): Promise<T> {
    const document = await this.repository.findById(id);
    if (!document) {
      throw new ApiError(`${this.modelName} not found`, 404);
    }
    return document;
  }

  /**
   * Create a new document
   */
  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  /**
   * Update document by ID
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    const document = await this.repository.findByIdAndUpdate(id, data);
    if (!document) {
      throw new ApiError(`${this.modelName} not found`, 404);
    }
    return document;
  }

  /**
   * Delete document by ID
   */
  async delete(id: string): Promise<void> {
    const document = await this.repository.findByIdAndDelete(id);
    if (!document) {
      throw new ApiError(`${this.modelName} not found`, 404);
    }
  }

  /**
   * Check if document exists
   */
  async exists(query: any): Promise<boolean> {
    const count = await this.repository.countDocuments(query);
    return count > 0;
  }
}
