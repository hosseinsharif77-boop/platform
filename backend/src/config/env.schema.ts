/**
 * Environment Validation Schema
 * 
 * Zod schema for validating environment variables.
 */

import { z } from 'zod';

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  API_VERSION: z.string().default('v1'),
  APP_NAME: z.string().default('Live Price Platform'),
  APP_URL: z.string().url().default('http://localhost:3000'),

  // MongoDB
  MONGODB_URI: z.string().default('mongodb://localhost:27017/live-price-platform'),
  MONGODB_MAX_POOL_SIZE: z.string().default('10'),
  MONGODB_MIN_POOL_SIZE: z.string().default('5'),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.string().default('0'),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),

  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // Storage
  STORAGE_TYPE: z.enum(['local', 's3', 'gcs']).default('local'),
  STORAGE_BUCKET: z.string().optional(),
  STORAGE_REGION: z.string().optional(),
  STORAGE_ACCESS_KEY: z.string().optional(),
  STORAGE_SECRET_KEY: z.string().optional(),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Security
  BCRYPT_SALT_ROUNDS: z.string().default('12'),
  MAX_LOGIN_ATTEMPTS: z.string().default('5'),
  LOCKOUT_DURATION_MINUTES: z.string().default('15'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export default envSchema;
