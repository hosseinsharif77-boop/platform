/**
 * Unexpected Errors
 * 
 * For internal/unexpected errors that should be logged and reported.
 */

import { AppError } from './AppError';

export class InternalError extends AppError {
  constructor(message = 'Internal server error', details?: any) {
    super(message, 500, 'INTERNAL_ERROR', false, details);
  }
}

export class NotImplementedError extends AppError {
  constructor(feature: string) {
    super(`Not implemented: ${feature}`, 501, 'NOT_IMPLEMENTED', true);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(service: string, details?: any) {
    super(
      `Service unavailable: ${service}`,
      503,
      'SERVICE_UNAVAILABLE',
      true,
      details
    );
  }
}

export default InternalError;
