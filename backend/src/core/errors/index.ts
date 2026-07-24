/**
 * Errors Index
 * 
 * Exports all error classes.
 */

export { AppError } from './AppError';
export { ValidationError } from './ValidationError';
export {
  AuthenticationError,
  TokenExpiredError,
  InvalidTokenError,
  RefreshTokenError,
} from './AuthenticationError';
export {
  AuthorizationError,
  ForbiddenError,
  InsufficientPermissionsError,
} from './AuthorizationError';
export {
  DatabaseError,
  NotFoundError,
  DuplicateError,
  ConnectionError,
} from './DatabaseError';
export {
  BusinessError,
  ConflictError,
  RateLimitError,
  ExternalServiceError,
} from './BusinessError';
export {
  InternalError,
  NotImplementedError,
  ServiceUnavailableError,
} from './InternalError';
