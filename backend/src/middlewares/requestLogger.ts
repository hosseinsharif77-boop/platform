/**
 * Request Logger Middleware
 * 
 * Logs HTTP requests with timing and context.
 */

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { httpLogger } from '../core/logger';

/**
 * Request ID middleware
 */
export const requestId = (req: Request, _res: Response, next: NextFunction): void => {
  const id = (req.headers['x-request-id'] as string) || uuidv4();
  req.headers['x-request-id'] = id;
  next();
};

/**
 * Request logger middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const requestId = req.headers['x-request-id'] as string;

  // Log request
  httpLogger.info('Request started', {
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function (chunk: any, encoding?: BufferEncoding | Function) {
    const duration = Date.now() - start;
    
    httpLogger.request(req.method, req.path, res.statusCode, duration, {
      requestId,
      contentLength: res.getHeader('content-length'),
    });

    originalEnd.call(this, chunk, encoding as BufferEncoding);
    return this;
  } as any;

  next();
};

export default requestLogger;
