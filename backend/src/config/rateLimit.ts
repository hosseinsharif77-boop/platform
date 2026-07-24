/**
 * Rate Limiting Configuration
 * 
 * Configures rate limiting to prevent abuse and protect the API.
 */

export const rateLimitConfig = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'You have exceeded the 100 requests in 15 minutes limit!',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
};
