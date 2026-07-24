/**
 * Authorization Error
 * 
 * Thrawn when authorization fails.
 */

import { AppError } from './AppError';

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied', details?: any) {
    super(message, 403, 'AUTHORIZATION_ERROR', true, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN', true);
  }
}

export class InsufficientPermissionsError extends AppError {
  constructor(requiredPermissions: string[]) {
    super(
      'Insufficient permissions',
      403,
      'INSUFFICIENT_PERMISSIONS',
      true,
      { required: requiredPermissions }
    );
  }
}

export default AuthorizationError;
