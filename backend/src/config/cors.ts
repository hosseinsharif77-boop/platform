/**
 * CORS Configuration
 * 
 * Configures Cross-Origin Resource Sharing settings for the API.
 */

import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400, // 24 hours
};
