/**
 * Application Configuration
 * 
 * Centralizes all frontend configuration constants.
 */

export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Live Price Platform',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    version: '1.0.0',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    timeout: 30000,
  },
  auth: {
    enabled: process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true',
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
  },
  features: {
    pricingEngine: process.env.NEXT_PUBLIC_ENABLE_PRICING_ENGINE === 'true',
    vendorDashboard: process.env.NEXT_PUBLIC_ENABLE_VENDOR_DASHBOARD === 'true',
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  },
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100,
  },
} as const;
