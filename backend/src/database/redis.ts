/**
 * Redis Connection (Optional)
 * 
 * Redis is optional. Server runs without it.
 */

import { logger } from '../core/logger';

class RedisConnection {
  private static instance: RedisConnection;
  private client: any = null;
  private isConnected = false;

  private constructor() {}

  static getInstance(): RedisConnection {
    if (!RedisConnection.instance) {
      RedisConnection.instance = new RedisConnection();
    }
    return RedisConnection.instance;
  }

  /**
   * Try to connect to Redis (optional)
   */
  async connect(): Promise<void> {
    try {
      // Try to import Redis dynamically
      const Redis = (await import('ioredis')).default;
      
      const host = process.env.REDIS_HOST || 'localhost';
      const port = parseInt(process.env.REDIS_PORT || '6379');
      
      this.client = new Redis({
        host,
        port,
        lazyConnect: true,
        connectTimeout: 2000,
        maxRetriesPerRequest: 0,
        enableOfflineQueue: false,
        autoResubscribe: false,
        autoResendUnfulfilledCommands: false,
        retryStrategy: () => null, // Don't retry
      });

      // Suppress all Redis errors
      this.client.on('error', () => {});
      this.client.on('reconnecting', () => {});
      this.client.on('end', () => {});

      await Promise.race([
        this.client.connect(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
      ]);

      this.isConnected = true;
      logger.info('✅ Redis connected');
    } catch {
      logger.info('ℹ️  Redis not available - running without cache');
      this.isConnected = false;
      this.client = null;
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.quit();
      } catch {}
      this.client = null;
      this.isConnected = false;
    }
  }

  /**
   * Get Redis client (returns null if not connected)
   */
  getClient(): any {
    return this.client;
  }

  /**
   * Check if Redis is available
   */
  isAvailable(): boolean {
    return this.isConnected && this.client !== null;
  }

  /**
   * Check connection health
   */
  async healthCheck(): Promise<boolean> {
    if (!this.isConnected || !this.client) return false;
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }
}

export const redis = RedisConnection.getInstance();
export default redis;
