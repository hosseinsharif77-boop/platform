/**
 * Application Configuration
 * 
 * This module sets up and configures the Express application with all
 * necessary middleware for production use.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { corsConfig } from './cors';
import { rateLimitConfig } from './rateLimit';
import { morganConfig } from './morgan';
import { errorHandler } from '../middlewares/errorHandler';
import { notFoundHandler } from '../middlewares/notFoundHandler';
import { routes } from '../routes';

const app = express();

// ===========================================
// Security Middleware
// ===========================================
app.use(helmet());

// ===========================================
// CORS Configuration
// ===========================================
app.use(cors(corsConfig));

// ===========================================
// Body Parsing
// ===========================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===========================================
// Compression
// ===========================================
app.use(compression());

// ===========================================
// Logging
// ===========================================
app.use(morgan(morganConfig.format, morganConfig.options));

// ===========================================
// Rate Limiting
// ===========================================
app.use(rateLimit(rateLimitConfig));

// ===========================================
// Health Check Endpoint
// ===========================================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ===========================================
// API Routes
// ===========================================
app.use('/api', routes);

// ===========================================
// Error Handling
// ===========================================
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
