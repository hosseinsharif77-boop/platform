/**
 * Logger Configuration
 * 
 * Winston logger with structured logging.
 * Supports multiple transports for different log types.
 */

import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

// Custom log format for development
const devFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (stack) msg += `\n${stack}`;
  if (Object.keys(metadata).length > 0) {
    msg += `\n${JSON.stringify(metadata, null, 2)}`;
  }
  return msg;
});

// Log directory
const logDir = path.join(process.cwd(), 'logs');

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json()
  ),
  defaultMeta: { service: 'live-price-platform' },
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
    
    // Combined logs
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 10,
    }),
    
    // Audit logs
    new winston.transports.File({
      filename: path.join(logDir, 'audit.log'),
      level: 'info',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 30,
    }),
  ],
});

// Development console transport
if (process.env.NODE_ENV === 'development') {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        devFormat
      ),
    })
  );
}

// Production console (JSON for log aggregation)
if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(
        timestamp(),
        json()
      ),
    })
  );
}

export default logger;
