/**
 * Health Check Middleware
 * 
 * Health check endpoint for monitoring.
 */

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { redis } from '../database/redis';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  services: {
    mongodb: 'up' | 'down';
    redis: 'up' | 'down';
  };
  memory: {
    heapUsed: number;
    heapTotal: number;
    external: number;
  };
  cpu: {
    user: number;
    system: number;
  };
}

export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  const healthStatus: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      mongodb: 'down',
      redis: 'down',
    },
    memory: {
      heapUsed: process.memoryUsage().heapUsed,
      heapTotal: process.memoryUsage().heapTotal,
      external: process.memoryUsage().external,
    },
    cpu: process.cpuUsage(),
  };

  // Check MongoDB
  try {
    const mongoState = mongoose.connection.readyState;
    healthStatus.services.mongodb = mongoState === 1 ? 'up' : 'down';
  } catch {
    healthStatus.services.mongodb = 'down';
  }

  // Check Redis
  try {
    const redisHealthy = await redis.healthCheck();
    healthStatus.services.redis = redisHealthy ? 'up' : 'down';
  } catch {
    healthStatus.services.redis = 'down';
  }

  // Determine overall status
  if (
    healthStatus.services.mongodb === 'down' ||
    healthStatus.services.redis === 'down'
  ) {
    healthStatus.status = 'unhealthy';
  }

  const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(healthStatus);
};

export default healthCheck;
