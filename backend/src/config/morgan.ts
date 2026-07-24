/**
 * Morgan Logger Configuration
 * 
 * Configures HTTP request logging for the API.
 */

export const morganConfig = {
  format: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  options: {
    skip: (req: any) => req.url === '/health', // Skip health check logs
    stream: process.stdout,
  },
};
