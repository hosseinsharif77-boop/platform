/**
 * Cache Service
 * 
 * Redis cache service for caching frequently accessed data.
 */

import Redis from 'ioredis';
import { redisConfig } from '../config/redis';
import { logger } from '../utils/logger';

class CacheService {
  private client: Redis | null = null;

  /**
   * Initialize Redis connection
   */
  async connect(): Promise<void> {
    try {
      this.client = new Redis(redisConfig);
      
      this.client.on('error', (err) => {
        logger.error('Redis Client Error:', err);
      });

      this.client.on('connect', () => {
        logger.info('Redis Client Connected');
      });

      await this.client.ping();
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  /**
   * Get value from cache
   */
  async get(key: string): Promise<string | null> {
    if (!this.client) {
      throw new Error('Redis client not initialized');
    }
    return this.client.get(key);
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.client) {
      throw new Error('Redis client not initialized');
    }
    if (ttl) {
      await this.client.setex(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  /**
   * Delete value from cache
   */
  async del(key: string): Promise<void> {
    if (!this.client) {
      throw new Error('Redis client not initialized');
    }
    await this.client.del(key);
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!this.client) {
      throw new Error('Redis client not initialized');
    }
    const result = await this.client.exists(key);
    return result === 1;
  }

  /**
   * Clear all cache
   */
  async flushAll(): Promise<void> {
    if (!this.client) {
      throw new Error('Redis client not initialized');
    }
    await this.client.flushall();
  }
}

export const cacheService = new CacheService();
