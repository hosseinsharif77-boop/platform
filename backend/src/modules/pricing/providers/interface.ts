/**
 * Price Provider Interface
 * 
 * Interface for price source providers.
 */

export interface PriceProvider {
  name: string;
  priority: number;
  
  /**
   * Get exchange rate between two currencies
   */
  getExchangeRate(from: string, to: string): Promise<number>;
  
  /**
   * Get list of supported currencies
   */
  getSupportedCurrencies(): string[];
  
  /**
   * Check if provider is available
   */
  isAvailable(): Promise<boolean>;
  
  /**
   * Get provider health status
   */
  getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    latency?: number;
    error?: string;
  }>;
}

export default PriceProvider;
