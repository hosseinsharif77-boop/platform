/**
 * Not Found Handler Middleware
 * 
 * Handles 404 routes.
 */

import { Request, Response } from 'express';
import { NotFoundError } from '../core/errors';

export const notFoundHandler = (req: Request, _res: Response): void => {
  throw new NotFoundError(`Route ${req.method} ${req.originalUrl}`);
};

export default notFoundHandler;
