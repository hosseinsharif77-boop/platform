/**
 * Authorization Middleware
 * 
 * Role-based access control and permission checking.
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from './authenticate';
import { AuthorizationError, InsufficientPermissionsError } from '../core/errors';

export enum UserRole {
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum Permission {
  // Store permissions
  STORE_CREATE = 'store:create',
  STORE_READ = 'store:read',
  STORE_UPDATE = 'store:update',
  STORE_DELETE = 'store:delete',
  
  // Product permissions
  PRODUCT_CREATE = 'product:create',
  PRODUCT_READ = 'product:read',
  PRODUCT_UPDATE = 'product:update',
  PRODUCT_DELETE = 'product:delete',
  
  // Order permissions
  ORDER_READ = 'order:read',
  ORDER_UPDATE = 'order:update',
  
  // User permissions
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  
  // Admin permissions
  ADMIN_ACCESS = 'admin:access',
  SYSTEM_SETTINGS = 'system:settings',
}

/**
 * Role-based authorization middleware
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AuthorizationError('Not authenticated'));
    }

    if (!roles.includes(req.user.role as UserRole)) {
      return next(new AuthorizationError('Insufficient role'));
    }

    next();
  };
};

/**
 * Permission-based authorization middleware
 */
export const requirePermission = (...permissions: Permission[]) => {
  return async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      return next(new AuthorizationError('Not authenticated'));
    }

    // TODO: Fetch user permissions from database or cache
    // For now, use role-based defaults
    const userPermissions = getPermissionsForRole(req.user.role as UserRole);

    const hasPermission = permissions.every(p => userPermissions.includes(p));

    if (!hasPermission) {
      return next(new InsufficientPermissionsError(permissions));
    }

    next();
  };
};

/**
 * Get default permissions for a role
 */
function getPermissionsForRole(role: UserRole): Permission[] {
  const rolePermissions: Record<UserRole, Permission[]> = {
    [UserRole.CUSTOMER]: [
      Permission.STORE_READ,
      Permission.PRODUCT_READ,
      Permission.ORDER_READ,
      Permission.USER_READ,
      Permission.USER_UPDATE,
    ],
    [UserRole.VENDOR]: [
      Permission.STORE_CREATE,
      Permission.STORE_READ,
      Permission.STORE_UPDATE,
      Permission.PRODUCT_CREATE,
      Permission.PRODUCT_READ,
      Permission.PRODUCT_UPDATE,
      Permission.PRODUCT_DELETE,
      Permission.ORDER_READ,
      Permission.ORDER_UPDATE,
      Permission.USER_READ,
      Permission.USER_UPDATE,
    ],
    [UserRole.ADMIN]: [
      Permission.STORE_CREATE,
      Permission.STORE_READ,
      Permission.STORE_UPDATE,
      Permission.STORE_DELETE,
      Permission.PRODUCT_CREATE,
      Permission.PRODUCT_READ,
      Permission.PRODUCT_UPDATE,
      Permission.PRODUCT_DELETE,
      Permission.ORDER_READ,
      Permission.ORDER_UPDATE,
      Permission.USER_READ,
      Permission.USER_UPDATE,
      Permission.USER_DELETE,
      Permission.ADMIN_ACCESS,
    ],
    [UserRole.SUPER_ADMIN]: Object.values(Permission),
  };

  return rolePermissions[role] || [];
}

export default authorize;
