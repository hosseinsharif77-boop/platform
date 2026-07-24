/**
 * Authentication Error
 * 
 * Thrown when authentication fails.
 */

import { AppError } from './AppError';

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed', details?: any) {
    super(message, 401, 'AUTHENTICATION_ERROR', true, details);
  }
}

export class TokenExpiredError extends AppError {
  constructor(message = 'Token has expired') {
    super(message, 401, 'TOKEN_EXPIRED', true);
  }
}

export class InvalidTokenError extends AppError {
  constructor(message = 'Invalid token') {
    super(message, 401, 'INVALID_TOKEN', true);
  }
}

export class RefreshTokenError extends AppError {
  constructor(message = 'Invalid refresh token') {
    super(message, 401, 'REFRESH_TOKEN_ERROR', true);
  }
}

export default AuthenticationError;
