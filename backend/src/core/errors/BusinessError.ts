/**
 * Business Errors
 * 
 * Business logic related error classes.
 */

import { AppError } from './AppError';

export class BusinessError extends AppError {
  constructor(message: string, code = 'BUSINESS_ERROR', details?: any) {
    super(message, 422, code, true, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict', details?: any) {
    super(message, 409, 'CONFLICT', true, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests', retryAfter?: number) {
    super(message, 429, 'RATE_LIMIT', true, { retryAfter });
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string) {
    super(
      message || `External service error: ${service}`,
      502,
      'EXTERNAL_SERVICE_ERROR',
      true,
      { service }
    );
  }
}

export default BusinessError;
