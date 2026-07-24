/**
 * Exchange Rate Provider
 * 
 * Fetches exchange rates from external APIs.
 */

import { PriceProvider } from './interface';
import { logger } from '../../../core/logger';

interface ExchangeRateResponse {
  rates: Record<string, number>;
  timestamp: number;
}

export class ExchangeRateProvider implements PriceProvider {
  name = 'exchange-rate-api';
  priority = 1;
  
  private apiKey: string;
  private baseUrl: string;
  private cache: Map<string, { rate: number; timestamp: number }> = new Map();
  private cacheTTL = 60000; // 1 minute

  constructor(config?: { apiKey?: string; baseUrl?: string }) {
    this.apiKey = config?.apiKey || process.env.EXCHANGE_RATE_API_KEY || '';
    this.baseUrl = config?.baseUrl || 'https://api.exchangerate-api.com/v4/latest';
  }

  async getExchangeRate(from: string, to: string): Promise<number> {
    if (from === to) return 1;

    const cacheKey = `${from}:${to}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.rate;
    }

    try {
      const rate = await this.fetchRate(from, to);
      
      this.cache.set(cacheKey, {
        rate,
        timestamp: Date.now(),
      });
      
      return rate;
    } catch (error) {
      logger.error('Failed to fetch exchange rate', error, { from, to });
      
      // Return cached rate if available
      if (cached) {
        return cached.rate;
      }
      
      throw error;
    }
  }

  private async fetchRate(from: string, to: string): Promise<number> {
    const url = `${this.baseUrl}/${from}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`);
    }
    
    const data = await response.json() as ExchangeRateResponse;
    
    if (!data.rates[to]) {
      throw new Error(`Currency ${to} not supported`);
    }
    
    return data.rates[to];
  }

  getSupportedCurrencies(): string[] {
    return [
      'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY',
      'SEK', 'NZD', 'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY',
      'INR', 'RUB', 'BRL', 'ZAR', 'IRR', 'AED', 'SAR', 'EGP',
    ];
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.getExchangeRate('USD', 'EUR');
      return true;
    } catch {
      return false;
    }
  }

  async getHealthStatus() {
    const start = Date.now();
    
    try {
      await this.getExchangeRate('USD', 'EUR');
      return {
        status: 'healthy' as const,
        latency: Date.now() - start,
      };
    } catch (error) {
      return {
        status: 'down' as const,
        latency: Date.now() - start,
        error: (error as Error).message,
      };
    }
  }
}

export default ExchangeRateProvider;
