/**
 * Rate Limiter Middleware
 * 
 * Request rate limiting using Redis.
 */

import { Request, Response, NextFunction } from 'express';
import { redis } from '../database/redis';
import { config } from '../config';
import { RateLimitError } from '../core/errors';

interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
  keyGenerator?: (req: Request) => string;
  message?: string;
}

/**
 * Rate limiter middleware
 */
export const rateLimiter = (options: RateLimitOptions = {}) => {
  const {
    windowMs = config.rateLimit.windowMs,
    maxRequests = config.rateLimit.maxRequests,
    keyGenerator = (req) => req.ip || req.headers['x-forwarded-for'] as string || 'unknown',
    message = 'Too many requests, please try again later',
  } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const client = redis.getClient();
      const key = `ratelimit:${keyGenerator(req)}`;
      
      // Get current count
      const current = await client.get(key);
      const count = current ? parseInt(current) : 0;

      // Set headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - count - 1));
      res.setHeader('X-RateLimit-Reset', Math.ceil(windowMs / 1000));

      if (count >= maxRequests) {
        throw new RateLimitError(message, Math.ceil(windowMs / 1000));
      }

      // Increment count
      if (count === 0) {
        await client.setex(key, Math.ceil(windowMs / 1000), '1');
      } else {
        await client.incr(key);
      }

      next();
    } catch (error) {
      if (error instanceof RateLimitError) {
        next(error);
      } else {
        // If Redis fails, allow the request
        next();
      }
    }
  };
};

/**
 * Strict rate limiter for sensitive endpoints
 */
export const strictRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: 'Too many attempts, please try again in 15 minutes',
});

/**
 * API rate limiter
 */
export const apiRateLimiter = rateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  maxRequests: 60,
});

export default rateLimiter;
