/**
 * Database Connection
 * 
 * MongoDB connection with connection pooling and health monitoring.
 */

import mongoose from 'mongoose';
import { config } from '../config';
import { logger } from '../core/logger';
import { ConnectionError } from '../core/errors';

class Database {
  private static instance: Database;
  private isConnected = false;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /**
   * Connect to MongoDB
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      logger.info('Database already connected');
      return;
    }

    try {
      const { uri, maxPoolSize, minPoolSize } = config.database;

      mongoose.set('strictQuery', true);

      await mongoose.connect(uri, {
        maxPoolSize,
        minPoolSize,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
      });

      this.isConnected = true;
      logger.info('✅ MongoDB connected successfully');

      // Connection event handlers
      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected');
        this.isConnected = true;
      });

    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      throw new ConnectionError('MongoDB', error);
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('MongoDB disconnected');
    } catch (error) {
      logger.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  /**
   * Check connection health
   */
  async healthCheck(): Promise<boolean> {
    try {
      const state = mongoose.connection.readyState;
      // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
      return state === 1;
    } catch {
      return false;
    }
  }

  /**
   * Get connection state
   */
  getConnectionState(): string {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    return states[mongoose.connection.readyState] || 'unknown';
  }
}

export const database = Database.getInstance();
export default database;
