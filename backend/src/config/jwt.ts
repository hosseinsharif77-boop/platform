/**
 * JWT Configuration
 * 
 * Configures JSON Web Token settings for authentication.
 */

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  issuer: 'live-price-platform',
  audience: 'live-price-platform-users',
};
