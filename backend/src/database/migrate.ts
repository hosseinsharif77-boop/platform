/**
 * Migration Utility
 * 
 * Database migration and seeding utilities.
 * For development and testing purposes only.
 */

import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../database/connection';
import { logger } from '../utils/logger';

// ===========================================
// SEED DATA
// ===========================================

const seedData = {
  currencies: [
    { code: 'USD', name: 'US Dollar', symbol: '$', isDefault: true, isActive: true },
    { code: 'EUR', name: 'Euro', symbol: '€', isDefault: false, isActive: true },
    { code: 'GBP', name: 'British Pound', symbol: '£', isDefault: false, isActive: true },
    { code: 'IRR', name: 'Iranian Rial', symbol: '﷼', isDefault: false, isActive: true },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', isDefault: false, isActive: true },
  ],

  systemSettings: [
    // General
    { key: 'site.name', value: 'Live Price Platform', category: 'general', isPublic: true, type: 'string' },
    { key: 'site.url', value: 'https://liveprice.io', category: 'general', isPublic: true, type: 'string' },
    { key: 'site.description', value: 'Modern Multi-Vendor Marketplace', category: 'general', isPublic: true, type: 'string' },
    
    // Auth
    { key: 'auth.registrationEnabled', value: true, category: 'auth', isPublic: true, type: 'boolean' },
    { key: 'auth.emailVerificationRequired', value: true, category: 'auth', isPublic: false, type: 'boolean' },
    { key: 'auth.maxLoginAttempts', value: 5, category: 'auth', isPublic: false, type: 'number' },
    
    // Store
    { key: 'store.approvalRequired', value: true, category: 'store', isPublic: false, type: 'boolean' },
    { key: 'store.maxProductsPerStore', value: 10000, category: 'store', isPublic: false, type: 'number' },
    { key: 'store.defaultCurrency', value: 'USD', category: 'store', isPublic: true, type: 'string' },
    
    // Pricing
    { key: 'pricing.autoUpdateEnabled', value: true, category: 'pricing', isPublic: false, type: 'boolean' },
    { key: 'pricing.updateIntervalMinutes', value: 15, category: 'pricing', isPublic: false, type: 'number' },
    { key: 'pricing.priceLockDurationMinutes', value: 15, category: 'pricing', isPublic: false, type: 'number' },
    
    // Notifications
    { key: 'notifications.emailEnabled', value: true, category: 'notifications', isPublic: false, type: 'boolean' },
    { key: 'notifications.pushEnabled', value: true, category: 'notifications', isPublic: false, type: 'boolean' },
  ],

  categories: [
    { name: 'Electronics', slug: 'electronics', level: 0, path: 'electronics', sortOrder: 1 },
    { name: 'Clothing', slug: 'clothing', level: 0, path: 'clothing', sortOrder: 2 },
    { name: 'Home & Garden', slug: 'home-garden', level: 0, path: 'home-garden', sortOrder: 3 },
    { name: 'Sports', slug: 'sports', level: 0, path: 'sports', sortOrder: 4 },
    { name: 'Books', slug: 'books', level: 0, path: 'books', sortOrder: 5 },
  ],
};

// ===========================================
// MIGRATION FUNCTIONS
// ===========================================

/**
 * Run all migrations
 */
export async function runMigrations(): Promise<void> {
  try {
    await connectDatabase();
    logger.info('Starting migrations...');

    // Add migration logic here
    // Example: await migrateUsers();
    
    logger.info('Migrations completed successfully');
    await disconnectDatabase();
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  }
}

/**
 * Seed database with initial data
 */
export async function seedDatabase(): Promise<void> {
  try {
    await connectDatabase();
    logger.info('Starting database seed...');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    // Seed currencies
    const currencyCount = await db.collection('currencies').countDocuments();
    if (currencyCount === 0) {
      await db.collection('currencies').insertMany(seedData.currencies);
      logger.info(`Seeded ${seedData.currencies.length} currencies`);
    }

    // Seed system settings
    const settingsCount = await db.collection('system_settings').countDocuments();
    if (settingsCount === 0) {
      await db.collection('system_settings').insertMany(
        seedData.systemSettings.map(s => ({
          ...s,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );
      logger.info(`Seeded ${seedData.systemSettings.length} system settings`);
    }

    // Seed categories
    const categoryCount = await db.collection('categories').countDocuments();
    if (categoryCount === 0) {
      await db.collection('categories').insertMany(
        seedData.categories.map(c => ({
          ...c,
          isActive: true,
          productCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );
      logger.info(`Seeded ${seedData.categories.length} categories`);
    }

    logger.info('Database seed completed successfully');
    await disconnectDatabase();
  } catch (error) {
    logger.error('Database seed failed:', error);
    throw error;
  }
}

/**
 * Clear all collections (development only)
 */
export async function clearDatabase(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot clear database in production');
  }

  try {
    await connectDatabase();
    logger.info('Clearing database...');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.dropCollection(collection.name);
      logger.info(`Dropped collection: ${collection.name}`);
    }

    logger.info('Database cleared successfully');
    await disconnectDatabase();
  } catch (error) {
    logger.error('Database clear failed:', error);
    throw error;
  }
}

/**
 * Reset database (clear + seed)
 */
export async function resetDatabase(): Promise<void> {
  await clearDatabase();
  await seedDatabase();
}

// ===========================================
// CLI COMMANDS
// ===========================================

if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case 'migrate':
      runMigrations().catch(console.error);
      break;
    case 'seed':
      seedDatabase().catch(console.error);
      break;
    case 'clear':
      clearDatabase().catch(console.error);
      break;
    case 'reset':
      resetDatabase().catch(console.error);
      break;
    default:
      console.log('Usage: ts-node migrate.ts [migrate|seed|clear|reset]');
      process.exit(1);
  }
}
