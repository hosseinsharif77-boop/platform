/**
 * Queue Definitions
 * 
 * All queue definitions for the application.
 * Queues are lazy-initialized to ensure Redis is connected first.
 */

import { Queue } from 'bullmq';
import { getQueueConnection } from './config';

// ===========================================
// QUEUE CACHE
// ===========================================

const queueCache: Map<string, Queue> = new Map();

/**
 * Get or create a queue (lazy initialization)
 */
function getOrCreateQueue(name: string, options?: any): Queue {
  if (queueCache.has(name)) {
    return queueCache.get(name)!;
  }

  const queue = new Queue(name, {
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

  queueCache.set(name, queue);
  return queue;
}

// ===========================================
// QUEUE GETTERS (lazy)
// ===========================================

export const getEmailQueue = () => getOrCreateQueue('email', {
  removeOnComplete: 50,
  removeOnFail: 20,
});

export const getNotificationQueue = () => getOrCreateQueue('notification', {
  removeOnComplete: 100,
  removeOnFail: 50,
});

export const getPriceUpdateQueue = () => getOrCreateQueue('price-update', {
  removeOnComplete: 200,
  removeOnFail: 100,
  attempts: 5,
});

export const getInventoryQueue = () => getOrCreateQueue('inventory', {
  removeOnComplete: 100,
  removeOnFail: 50,
});

export const getAnalyticsQueue = () => getOrCreateQueue('analytics', {
  removeOnComplete: 50,
  removeOnFail: 25,
});

export const getImageQueue = () => getOrCreateQueue('image', {
  removeOnComplete: 50,
  removeOnFail: 25,
});

// ===========================================
// JOB TYPES
// ===========================================

export enum EmailJobType {
  SEND = 'send',
  SEND_BULK = 'send-bulk',
  SEND_TEMPLATE = 'send-template',
}

export enum NotificationJobType {
  IN_APP = 'in-app',
  EMAIL = 'email',
  PUSH = 'push',
  SMS = 'sms',
}

export enum PriceUpdateJobType {
  SINGLE = 'single',
  BULK = 'bulk',
  SCHEDULED = 'scheduled',
  EXCHANGE_RATE = 'exchange-rate',
}

export enum InventoryJobType {
  UPDATE = 'update',
  RESERVE = 'reserve',
  RELEASE = 'release',
  SYNC = 'sync',
}

export enum AnalyticsJobType {
  TRACK_EVENT = 'track-event',
  AGGREGATE = 'aggregate',
  REPORT = 'report',
}

export enum ImageJobType {
  UPLOAD = 'upload',
  RESIZE = 'resize',
  OPTIMIZE = 'optimize',
  DELETE = 'delete',
}

// ===========================================
// QUEUE MAP (lazy getters)
// ===========================================

export const queues = {
  get email() { return getEmailQueue(); },
  get notification() { return getNotificationQueue(); },
  get priceUpdate() { return getPriceUpdateQueue(); },
  get inventory() { return getInventoryQueue(); },
  get analytics() { return getAnalyticsQueue(); },
  get image() { return getImageQueue(); },
};

export default queues;
