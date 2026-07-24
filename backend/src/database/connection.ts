/**
 * Database Connection
 * 
 * Establishes and manages the MongoDB connection using Mongoose.
 */

import mongoose from 'mongoose';
import { databaseConfig } from '../config/database';
import { logger } from '../utils/logger';

/**
 * Connect to MongoDB
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(databaseConfig.uri, databaseConfig.options);
    
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected successfully');
    });

  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error('Failed to disconnect from MongoDB:', error);
    throw error;
  }
};
