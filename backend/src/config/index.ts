/**
 * Configuration Loader
 * 
 * Loads and validates environment variables.
 * Provides typed configuration object.
 */

import dotenv from 'dotenv';
import envSchema, { EnvConfig } from './env.schema';

// Load environment variables
dotenv.config();

class Config {
  private static instance: Config;
  private config: EnvConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  /**
   * Load and validate configuration
   */
  private loadConfig(): EnvConfig {
    try {
      const parsed = envSchema.parse(process.env);
      return parsed;
    } catch (error) {
      console.error('❌ Invalid environment configuration:');
      console.error(error);
      process.exit(1);
    }
  }

  /**
   * Get all configuration
   */
  get all(): EnvConfig {
    return this.config;
  }

  /**
   * Get specific configuration value
   */
  get<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
    return this.config[key];
  }

  /**
   * Check if running in development
   */
  get isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  /**
   * Check if running in production
   */
  get isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  /**
   * Check if running in test
   */
  get isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }

  /**
   * Get database configuration
   */
  get database() {
    return {
      uri: this.config.MONGODB_URI,
      maxPoolSize: parseInt(this.config.MONGODB_MAX_POOL_SIZE),
      minPoolSize: parseInt(this.config.MONGODB_MIN_POOL_SIZE),
    };
  }

  /**
   * Get Redis configuration
   */
  get redis() {
    return {
      host: this.config.REDIS_HOST,
      port: parseInt(this.config.REDIS_PORT),
      password: this.config.REDIS_PASSWORD,
      db: parseInt(this.config.REDIS_DB),
    };
  }

  /**
   * Get JWT configuration
   */
  get jwt() {
    return {
      secret: this.config.JWT_SECRET,
      expiresIn: this.config.JWT_EXPIRES_IN,
      refreshSecret: this.config.JWT_REFRESH_SECRET,
      refreshExpiresIn: this.config.JWT_REFRESH_EXPIRES_IN,
    };
  }

  /**
   * Get CORS configuration
   */
  get cors() {
    return {
      origin: this.config.CORS_ORIGIN.split(','),
      credentials: true,
    };
  }

  /**
   * Get rate limit configuration
   */
  get rateLimit() {
    return {
      windowMs: parseInt(this.config.RATE_LIMIT_WINDOW_MS),
      maxRequests: parseInt(this.config.RATE_LIMIT_MAX_REQUESTS),
    };
  }

  /**
   * Get email configuration
   */
  get email() {
    return {
      host: this.config.SMTP_HOST,
      port: this.config.SMTP_PORT ? parseInt(this.config.SMTP_PORT) : 587,
      user: this.config.SMTP_USER,
      pass: this.config.SMTP_PASS,
      from: this.config.EMAIL_FROM,
    };
  }

  /**
   * Get storage configuration
   */
  get storage() {
    return {
      type: this.config.STORAGE_TYPE,
      bucket: this.config.STORAGE_BUCKET,
      region: this.config.STORAGE_REGION,
      accessKey: this.config.STORAGE_ACCESS_KEY,
      secretKey: this.config.STORAGE_SECRET_KEY,
    };
  }
}

// Export singleton instance
export const config = Config.getInstance();
export default config;
