/**
 * Database Configuration
 * 
 * Configures MongoDB connection settings.
 */

export const databaseConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/live-price-platform',
  options: {
    maxPoolSize: 10,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
  },
};
