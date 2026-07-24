/**
 * Cache Service (Optional)
 * 
 * Redis is optional. Cache operations are no-ops when Redis is not available.
 */

import { redis } from '../database/redis';

export interface CacheOptions {
  ttl?: number;
  prefix?: string;
}

class CacheService {
  private static instance: CacheService;
  private defaultTTL = 3600;
  private prefix = 'cache:';
  private memoryCache: Map<string, { value: any; expiresAt: number }> = new Map();

  private constructor() {}

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Get value from cache (Redis or memory fallback)
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (redis.isAvailable()) {
        const client = redis.getClient();
        const fullKey = this.getFullKey(key);
        const value = await client.get(fullKey);
        if (!value) return null;
        return JSON.parse(value) as T;
      }
      
      // Memory fallback
      const cached = this.memoryCache.get(this.getFullKey(key));
      if (cached && cached.expiresAt > Date.now()) {
        return cached.value as T;
      }
      this.memoryCache.delete(this.getFullKey(key));
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: any, options?: CacheOptions): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      const ttl = options?.ttl || this.defaultTTL;
      const serialized = JSON.stringify(value);
      
      if (redis.isAvailable()) {
        const client = redis.getClient();
        await client.setex(fullKey, ttl, serialized);
      } else {
        // Memory fallback
        this.memoryCache.set(fullKey, {
          value,
          expiresAt: Date.now() + ttl * 1000,
        });
      }
    } catch {
      // Silently fail
    }
  }

  /**
   * Delete value from cache
   */
  async del(key: string): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      
      if (redis.isAvailable()) {
        const client = redis.getClient();
        await client.del(fullKey);
      } else {
        this.memoryCache.delete(fullKey);
      }
    } catch {
      // Silently fail
    }
  }

  /**
   * Delete multiple keys by pattern
   */
  async delByPattern(pattern: string): Promise<void> {
    try {
      const fullPattern = this.getFullKey(pattern);
      
      if (redis.isAvailable()) {
        const client = redis.getClient();
        const keys = await client.keys(fullPattern);
        if (keys.length > 0) {
          await client.del(...keys);
        }
      } else {
        // Memory fallback - delete matching keys
        const regex = new RegExp('^' + fullPattern.replace(/\*/g, '.*') + '$');
        for (const key of this.memoryCache.keys()) {
          if (regex.test(key)) {
            this.memoryCache.delete(key);
          }
        }
      }
    } catch {
      // Silently fail
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const fullKey = this.getFullKey(key);
      
      if (redis.isAvailable()) {
        const client = redis.getClient();
        const result = await client.exists(fullKey);
        return result === 1;
      }
      
      const cached = this.memoryCache.get(fullKey);
      return cached !== undefined && cached.expiresAt > Date.now();
    } catch {
      return false;
    }
  }

  /**
   * Flush all cache
   */
  async flush(): Promise<void> {
    try {
      if (redis.isAvailable()) {
        const client = redis.getClient();
        const keys = await client.keys(`${this.prefix}*`);
        if (keys.length > 0) {
          await client.del(...keys);
        }
      } else {
        this.memoryCache.clear();
      }
    } catch {
      // Silently fail
    }
  }

  /**
   * Get full key with prefix
   */
  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}

export const cache = CacheService.getInstance();
export default cache;
