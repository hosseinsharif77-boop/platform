/**
 * Redis Configuration
 * 
 * Configures Redis connection settings for caching.
 */

export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  retryDelayOnFailover: 100,
  retryDelayOnClusterDown: 100,
  maxRetriesPerRequest: 3,
};
