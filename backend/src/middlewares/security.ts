/**
 * Security Middleware
 * 
 * Security-related middleware (helmet, CORS, etc.)
 */

import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { config } from '../config';

/**
 * Security headers middleware
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

/**
 * CORS middleware
 */
export const corsMiddleware = cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'X-Store-Id'],
  exposedHeaders: ['X-Request-Id', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  maxAge: 86400,
});

/**
 * Compression middleware
 */
export const compressionMiddleware = compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6,
  threshold: 1024,
});

/**
 * Sanitize input middleware
 */
export const sanitizeInput = (req: Request, _res: Response, next: NextFunction): void => {
  // Sanitize body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query) as any;
  }

  next();
};

/**
 * Recursively sanitize object
 */
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    // Remove HTML tags
    return obj.replace(/<[^>]*>/g, '').trim();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
}

export default {
  securityHeaders,
  corsMiddleware,
  compressionMiddleware,
  sanitizeInput,
};
