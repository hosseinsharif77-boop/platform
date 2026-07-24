/**
 * Base Controller
 * 
 * Generic controller layer for handling HTTP requests.
 * Provides common CRUD operations.
 */

import { Request, Response, NextFunction } from 'express';
import { BaseService } from '../services/baseService';
import { sendSuccess, sendPaginatedResponse } from '../utils/response';

export class BaseController<T> {
  protected service: BaseService<any>;
  protected resourceName: string;

  constructor(service: BaseService<any>, resourceName: string) {
    this.service = service;
    this.resourceName = resourceName;
  }

  /**
   * Get all documents
   */
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', ...query } = req.query;

      const result = await this.service.getAll(query, {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      });

      sendPaginatedResponse(
        res,
        result.data,
        result.totalCount,
        result.page,
        result.limit,
        `${this.resourceName} retrieved successfully`
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get document by ID
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const document = await this.service.getById(id);
      sendSuccess(res, document, `${this.resourceName} retrieved successfully`);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create new document
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const document = await this.service.create(req.body);
      sendSuccess(res, document, `${this.resourceName} created successfully`, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update document by ID
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const document = await this.service.update(id, req.body);
      sendSuccess(res, document, `${this.resourceName} updated successfully`);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete document by ID
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      sendSuccess(res, null, `${this.resourceName} deleted successfully`);
    } catch (error) {
      next(error);
    }
  };
}
