/**
 * Queue Configuration
 * 
 * BullMQ queue setup with Redis connection.
 * Redis is optional - queues won't work without it.
 */

import { logger } from '../core/logger';

/**
 * Get Redis connection options for BullMQ
 */
export const getQueueConnection = () => {
  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
  };
};

/**
 * Create a queue
 */
export const createQueue = (name: string, options?: any): Queue => {
  return new Queue(name, {
    connection: getQueueConnection(),
    defaultJobOptions: {
      removeOnComplete: 100,
      removeOnFail: 50,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      ...options,
    },
  });
};

/**
 * Create a worker
 */
export const createWorker = <T = any>(
  name: string,
  processor: (job: any) => Promise<T>,
  options?: any
): Worker => {
  const worker = new Worker(
    name,
    async (job) => {
      logger.info(`Processing job ${job.id} in queue ${name}`, {
        jobId: job.id,
        data: job.data,
      });
      
      try {
        const result = await processor(job);
        logger.info(`Job ${job.id} completed in queue ${name}`);
        return result;
      } catch (error) {
        logger.error(`Job ${job.id} failed in queue ${name}`, error);
        throw error;
      }
    },
    {
      connection: getQueueConnection(),
      concurrency: options?.concurrency || 5,
      ...options,
    }
  );

  worker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed in queue ${name}`, err);
  });

  worker.on('completed', (job) => {
    logger.debug(`Job ${job.id} completed in queue ${name}`);
  });

  return worker;
};

/**
 * Create queue scheduler
 */
export const createQueueScheduler = (name: string): QueueScheduler => {
  return new QueueScheduler(name, {
    connection: getQueueConnection(),
  });
};

/**
 * Create queue events
 */
export const createQueueEvents = (name: string): QueueEvents => {
  return new QueueEvents(name, {
    connection: getQueueConnection(),
  });
};

export default {
  createQueue,
  createWorker,
  createQueueScheduler,
  createQueueEvents,
};
