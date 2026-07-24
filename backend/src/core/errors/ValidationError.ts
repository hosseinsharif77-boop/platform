/**
 * Validation Error
 * 
 * Thrown when request validation fails.
 */

import { AppError } from './AppError';
import { ZodError } from 'zod';

export class ValidationError extends AppError {
  public readonly validationErrors: any[];

  constructor(message: string, errors: any[] | ZodError) {
    super(message, 400, 'VALIDATION_ERROR', true);
    
    if (errors instanceof ZodError) {
      this.validationErrors = errors.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));
    } else {
      this.validationErrors = errors;
    }
  }

  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.validationErrors,
        timestamp: this.timestamp.toISOString(),
      },
    };
  }
}

export default ValidationError;
