/**
 * Server Configuration
 * 
 * Centralizes all server-related configuration.
 */

export const serverConfig = {
  port: parseInt(process.env.PORT || '5000'),
  env: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || 'v1',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};
