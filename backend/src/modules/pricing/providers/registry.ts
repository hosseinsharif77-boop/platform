/**
 * Provider Registry
 * 
 * Manages price providers and provides fallback logic.
 */

import { PriceProvider } from './interface';
import { ExchangeRateProvider } from './exchangeRate.provider';
import { logger } from '../../../core/logger';

class ProviderRegistry {
  private providers: Map<string, PriceProvider> = new Map();
  private static instance: ProviderRegistry;

  private constructor() {
    // Register default providers
    this.register(new ExchangeRateProvider());
  }

  static getInstance(): ProviderRegistry {
    if (!ProviderRegistry.instance) {
      ProviderRegistry.instance = new ProviderRegistry();
    }
    return ProviderRegistry.instance;
  }

  /**
   * Register a new provider
   */
  register(provider: PriceProvider): void {
    this.providers.set(provider.name, provider);
    logger.info(`Registered pricing provider: ${provider.name}`);
  }

  /**
   * Unregister a provider
   */
  unregister(name: string): void {
    this.providers.delete(name);
    logger.info(`Unregistered pricing provider: ${name}`);
  }

  /**
   * Get provider by name
   */
  get(name: string): PriceProvider | undefined {
    return this.providers.get(name);
  }

  /**
   * Get all providers sorted by priority
   */
  getAll(): PriceProvider[] {
    return Array.from(this.providers.values())
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Get available providers
   */
  async getAvailable(): Promise<PriceProvider[]> {
    const available: PriceProvider[] = [];
    
    for (const provider of this.getAll()) {
      try {
        const isAvailable = await provider.isAvailable();
        if (isAvailable) {
          available.push(provider);
        }
      } catch {
        // Provider unavailable
      }
    }
    
    return available;
  }

  /**
   * Get exchange rate with fallback
   */
  async getExchangeRate(from: string, to: string): Promise<number> {
    if (from === to) return 1;

    const providers = await this.getAvailable();
    
    for (const provider of providers) {
      try {
        const rate = await provider.getExchangeRate(from, to);
        if (rate > 0) {
          return rate;
        }
      } catch (error) {
        logger.warn(`Provider ${provider.name} failed`, error);
        continue;
      }
    }
    
    throw new Error(`No provider available for ${from} to ${to}`);
  }

  /**
   * Get health status of all providers
   */
  async getHealthStatus(): Promise<Record<string, any>> {
    const status: Record<string, any> = {};
    
    for (const [name, provider] of this.providers) {
      status[name] = await provider.getHealthStatus();
    }
    
    return status;
  }
}

export const providerRegistry = ProviderRegistry.getInstance();
export default providerRegistry;
