/**
 * Environment Type Definitions
 * 
 * TypeScript type definitions for client-side environment variables.
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test';
      readonly NEXT_PUBLIC_APP_NAME: string;
      readonly NEXT_PUBLIC_APP_URL: string;
      readonly NEXT_PUBLIC_API_URL: string;
      readonly NEXT_PUBLIC_AUTH_ENABLED: string;
      readonly NEXT_PUBLIC_ENABLE_PRICING_ENGINE: string;
      readonly NEXT_PUBLIC_ENABLE_VENDOR_DASHBOARD: string;
      readonly NEXT_PUBLIC_ENABLE_ANALYTICS: string;
    }
  }
}

export {};
