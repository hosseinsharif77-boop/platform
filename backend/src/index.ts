/**
 * Server Entry Point
 * 
 * Main entry point for the application.
 * Handles server startup, graceful shutdown, and error handling.
 */

import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { config } from './config';
import { database } from './database';
import { redis } from './database/redis';
import { logger } from './core/logger';
import { initializeEventHandlers } from './events/handlers';
import { initializeWorkers } from './queues/workers';

// ===========================================
// STARTUP
// ===========================================

const startServer = async (): Promise<void> => {
  try {
    logger.info('🚀 Starting Live Price Platform...');

    // Connect to MongoDB
    await database.connect();
    logger.info('✅ Database connected');

    // Try to connect to Redis (optional)
    try {
      await redis.connect();
    } catch (e) {
      // Redis is optional, continue without it
    }

    // Initialize event handlers
    initializeEventHandlers();

    // Initialize queue workers
    initializeWorkers();

    // Start server
    const port = parseInt(config.get('PORT'));
    const server = app.listen(port, () => {
      logger.info(`✅ Server running on port ${port}`);
      logger.info(`📍 Environment: ${config.get('NODE_ENV')}`);
      logger.info(`🔗 API URL: http://localhost:${port}/api`);
      logger.info(`❤️  Health Check: http://localhost:${port}/health`);
    });

    // ===========================================
    // GRACEFUL SHUTDOWN
    // ===========================================

    const gracefulShutdown = async (signal: string) => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await database.disconnect();
          logger.info('Database disconnected');
        } catch (error) {
          logger.error('Error disconnecting from database:', error);
        }

        try {
          await redis.disconnect();
          logger.info('Redis disconnected');
        } catch (error) {
          logger.error('Error disconnecting from Redis:', error);
        }

        logger.info('Graceful shutdown completed');
        process.exit(0);
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown due to timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // ===========================================
    // ERROR HANDLERS
    // ===========================================

    process.on('unhandledRejection', (reason: Error) => {
      logger.error('Unhandled Rejection:', reason);
    });

    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
