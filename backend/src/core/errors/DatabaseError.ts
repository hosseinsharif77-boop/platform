/**
 * Database Errors
 * 
 * Database-related error classes.
 */

import { AppError } from './AppError';

export class DatabaseError extends AppError {
  constructor(message = 'Database error', details?: any) {
    super(message, 500, 'DATABASE_ERROR', true, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource', id?: string) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
    super(message, 404, 'NOT_FOUND', true, { resource, id });
  }
}

export class DuplicateError extends AppError {
  constructor(field: string, value: any) {
    super(
      `Duplicate value for ${field}`,
      409,
      'DUPLICATE_ERROR',
      true,
      { field, value }
    );
  }
}

export class ConnectionError extends AppError {
  constructor(service = 'Database', details?: any) {
    super(`Connection failed: ${service}`, 503, 'CONNECTION_ERROR', true, details);
  }
}

export default DatabaseError;
