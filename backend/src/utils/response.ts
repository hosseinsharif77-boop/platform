/**
 * Response Helper
 * 
 * Standardized API response helper.
 */

import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta?: Record<string, any>;
}

/**
 * Send success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
};

/**
 * Send created response
 */
export const sendCreated = <T>(
  res: Response,
  data: T,
  message = 'Created successfully'
): void => {
  sendSuccess(res, data, message, 201);
};

/**
 * Send paginated response
 */
export const sendPaginated = <T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = 'Success'
): void => {
  const pages = Math.ceil(total / limit);
  const response: ApiResponse<T[]> = {
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    },
  };
  res.status(200).json(response);
};

/**
 * Send no content response
 */
export const sendNoContent = (res: Response): void => {
  res.status(204).send();
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: any
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    error: {
      code,
      message,
      details,
    },
  };
  res.status(statusCode).json(response);
};

export default {
  sendSuccess,
  sendCreated,
  sendPaginated,
  sendNoContent,
  sendError,
};
