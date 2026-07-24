/**
 * Environment Type Definitions
 * 
 * TypeScript type definitions for environment variables.
 */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: string;
    API_VERSION: string;
    MONGODB_URI: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD?: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES_IN: string;
    CORS_ORIGIN: string;
    RATE_LIMIT_WINDOW_MS: string;
    RATE_LIMIT_MAX_REQUESTS: string;
    LOG_LEVEL: string;
  }
}
