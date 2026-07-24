/**
 * Tenant Resolver Middleware
 * 
 * Resolves tenant (store) from request context.
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from './authenticate';
import { NotFoundError } from '../core/errors';
import { cache } from '../database/cache';

/**
 * Tenant resolver middleware
 */
export const tenantResolver = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const storeId = req.storeId;

    if (!storeId) {
      return next();
    }

    // Try to get store from cache
    let store = await cache.get<any>(`store:${storeId}`);

    if (!store) {
      // TODO: Fetch from database
      // const { Store } = await import('../modules/store/store.model');
      // store = await Store.findById(storeId);
      
      // For now, assume store exists
      store = { _id: storeId, status: 'active' };
      
      // Cache for 5 minutes
      await cache.set(`store:${storeId}`, store, { ttl: 300 });
    }

    if (!store || store.status !== 'active') {
      return next(new NotFoundError('Store'));
    }

    // Attach store to request
    (req as any).store = store;

    next();
  } catch (error) {
    next(error);
  }
};

export default tenantResolver;
