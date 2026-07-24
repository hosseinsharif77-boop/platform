/**
 * Error Handler Middleware
 * 
 * Global error handling middleware.
 * Converts errors to standardized API responses.
 */

import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError, InternalError } from '../core/errors';
import { logger } from '../core/logger';
import { config } from '../config';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log the error
  if (err instanceof AppError && err.isOperational) {
    logger.warn('Operational error:', {
      code: err.code,
      message: err.message,
      path: req.path,
      method: req.method,
    });
  } else {
    logger.error('Unexpected error:', err, {
      path: req.path,
      method: req.method,
      requestId: req.headers['x-request-id'],
    });
  }

  // Handle known operational errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json(err.toJSON());
    return;
  }

  // Handle validation errors (Joi, Zod)
  if (err.name === 'ValidationError') {
    const validationError = new ValidationError('Validation failed', (err as any).details);
    res.status(400).json(validationError.toJSON());
    return;
  }

  // Handle MongoDB duplicate key errors
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern)[0];
    res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_ERROR',
        message: `Duplicate value for field: ${field}`,
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid token',
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Token has expired',
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  // Handle unexpected errors
  const internalError = new InternalError(
    config.isDevelopment ? err.message : 'Internal server error'
  );
  res.status(500).json(internalError.toJSON());
};

export default errorHandler;
