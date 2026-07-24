/**
 * Logger Service
 * 
 * Structured logging service with context support.
 */

import logger from './config';

export enum LogContext {
  HTTP = 'http',
  AUTH = 'auth',
  DB = 'database',
  CACHE = 'cache',
  QUEUE = 'queue',
  EMAIL = 'email',
  WEBSOCKET = 'websocket',
  JOB = 'job',
  EVENT = 'event',
  AUDIT = 'audit',
}

class LoggerService {
  private context: string;

  constructor(context: string = LogContext.HTTP) {
    this.context = context;
  }

  /**
   * Create a child logger with context
   */
  child(context: string): LoggerService {
    return new LoggerService(context);
  }

  /**
   * Info level logging
   */
  info(message: string, meta?: any): void {
    logger.info(message, {
      context: this.context,
      ...meta,
    });
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error | any, meta?: any): void {
    logger.error(message, {
      context: this.context,
      error: error?.message,
      stack: error?.stack,
      ...meta,
    });
  }

  /**
   * Warning level logging
   */
  warn(message: string, meta?: any): void {
    logger.warn(message, {
      context: this.context,
      ...meta,
    });
  }

  /**
   * Debug level logging
   */
  debug(message: string, meta?: any): void {
    logger.debug(message, {
      context: this.context,
      ...meta,
    });
  }

  /**
   * HTTP request logging
   */
  request(method: string, path: string, statusCode: number, duration: number, meta?: any): void {
    logger.info('HTTP Request', {
      context: LogContext.HTTP,
      method,
      path,
      statusCode,
      duration,
      ...meta,
    });
  }

  /**
   * Authentication event logging
   */
  auth(event: string, userId?: string, meta?: any): void {
    logger.info('Auth Event', {
      context: LogContext.AUTH,
      event,
      userId,
      ...meta,
    });
  }

  /**
   * Database operation logging
   */
  database(operation: string, collection: string, duration: number, meta?: any): void {
    logger.debug('Database Operation', {
      context: LogContext.DB,
      operation,
      collection,
      duration,
      ...meta,
    });
  }

  /**
   * Audit logging (for compliance)
   */
  audit(action: string, userId: string, entity: string, entityId?: string, changes?: any): void {
    logger.info('Audit Event', {
      context: LogContext.AUDIT,
      action,
      userId,
      entity,
      entityId,
      changes,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Security event logging
   */
  security(event: string, meta?: any): void {
    logger.warn('Security Event', {
      context: 'security',
      event,
      ...meta,
    });
  }
}

// Create singleton instances for different contexts
export const httpLogger = new LoggerService(LogContext.HTTP);
export const authLogger = new LoggerService(LogContext.AUTH);
export const dbLogger = new LoggerService(LogContext.DB);
export const cacheLogger = new LoggerService(LogContext.CACHE);
export const queueLogger = new LoggerService(LogContext.QUEUE);
export const emailLogger = new LoggerService(LogContext.EMAIL);
export const auditLogger = new LoggerService(LogContext.AUDIT);

// Factory function
export function createLogger(context: string): LoggerService {
  return new LoggerService(context);
}

// Export logger instance for direct use
export { logger } from './config';

export { LoggerService };
export default LoggerService;
