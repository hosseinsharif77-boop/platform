/**
 * Routes Index
 * 
 * Central route configuration for all API endpoints.
 */

import { Router } from 'express';
import { serverConfig } from '../config/server';

const router = Router();

/**
 * Health check route
 */
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    version: serverConfig.apiVersion,
  });
});

/**
 * API version prefix
 * All routes should be prefixed with /api
 */
router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Live Price Platform API',
    version: serverConfig.apiVersion,
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      // Add more endpoints as they are created
    },
  });
});

// Import and use feature routes
// import authRoutes from './auth.routes';
// router.use('/auth', authRoutes);

export { router as routes };
