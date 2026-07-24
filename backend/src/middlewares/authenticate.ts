/**
 * Authentication Middleware
 * 
 * JWT token verification and user authentication.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthenticationError, TokenExpiredError, InvalidTokenError } from '../core/errors';
import { authLogger } from '../core/logger';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
  storeId?: string;
}

/**
 * Verify JWT token middleware
 */
export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as AuthUser;
      req.user = decoded;
      next();
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new TokenExpiredError();
      }
      throw new InvalidTokenError();
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication (doesn't fail if no token)
 */
export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as AuthUser;
      req.user = decoded;
    } catch {
      // Ignore invalid tokens for optional auth
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Extract store ID from header or query
 */
export const extractStoreId = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const storeId = req.headers['x-store-id'] as string || req.query.storeId as string;
  
  if (storeId) {
    req.storeId = storeId;
  }
  
  next();
};

export default authenticate;
