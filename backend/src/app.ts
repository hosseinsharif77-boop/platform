/**
 * Application Configuration
 * 
 * Express app setup with all middleware.
 */

import express from 'express';
import { config } from './config';
import {
  securityHeaders,
  corsMiddleware,
  compressionMiddleware,
  requestId,
  requestLogger,
  sanitizeInput,
  errorHandler,
  notFoundHandler,
  healthCheck,
} from './middlewares';

const app = express();

// ===========================================
// SECURITY MIDDLEWARES
// ===========================================

app.use(securityHeaders);
app.use(corsMiddleware);
app.use(compressionMiddleware);

// ===========================================
// REQUEST PARSING
// ===========================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===========================================
// REQUEST PROCESSING
// ===========================================

app.use(requestId);
app.use(requestLogger);
app.use(sanitizeInput);

// ===========================================
// HEALTH CHECK
// ===========================================

app.get('/health', healthCheck);
app.get('/api/health', healthCheck);

// ===========================================
// API ROUTES
// ===========================================

// TODO: Import and use route modules
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/stores', storeRoutes);
// app.use('/api/v1/products', productRoutes);
// app.use('/api/v1/orders', orderRoutes);
// app.use('/api/v1/pricing', pricingRoutes);

// API welcome message
app.get('/api', (_req, res) => {
  res.json({
    success: true,
    message: 'Live Price Platform API',
    version: config.get('API_VERSION'),
    documentation: '/api/docs',
  });
});

// ===========================================
// ERROR HANDLING
// ===========================================

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
