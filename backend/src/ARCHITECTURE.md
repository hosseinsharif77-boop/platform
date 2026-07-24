/**
 * Backend Architecture Documentation
 * 
 * Live Price Platform - Backend Core Architecture
 * 
 * ===========================================
 * ARCHITECTURE PRINCIPLES
 * ===========================================
 * 
 * 1. CLEAN ARCHITECTURE
 *    - Dependencies point inward (Routes → Controllers → Services → Repositories)
 *    - Business logic NEVER exists in controllers
 *    - Repositories ONLY communicate with MongoDB
 *    - Services contain business logic
 * 
 * 2. FEATURE-BASED MODULES
 *    - Each feature is self-contained
 *    - Modules contain: controller, service, repository, model, validator, routes, dto, mapper
 * 
 * 3. DEPENDENCY INJECTION
 *    - Services receive dependencies via constructor
 *    - Enables testability and flexibility
 * 
 * 4. SOLID PRINCIPLES
 *    - Single Responsibility: Each class has one job
 *    - Open/Closed: Extend without modifying
 *    - Liskov Substitution: Subtypes are substitutable
 *    - Interface Segregation: Small, focused interfaces
 *    - Dependency Inversion: Depend on abstractions
 * 
 * ===========================================
 * REQUEST FLOW
 * ===========================================
 * 
 * Client Request
 *      ↓
 * Express Router
 *      ↓
 * Global Middlewares (Helmet, CORS, Rate Limit, Request ID)
 *      ↓
 * Route Middlewares (Auth, Permission, Validation)
 *      ↓
 * Controller
 *      ↓
 * Service (Business Logic)
 *      ↓
 * Repository (Data Access)
 *      ↓
 * MongoDB / Redis
 *      ↓
 * Response (via Response Helper)
 *      ↓
 * Client Response
 * 
 * ===========================================
 * RESPONSE FLOW
 * 
 * Service returns result
 *      ↓
 * Controller formats response
 *      ↓
 * Response Helper standardizes format
 *      ↓
 * JSON response to client
 * 
 * Standard Response Format:
 * {
 *   success: boolean,
 *   message: string,
 *   data?: any,
 *   error?: { code, message, details },
 *   pagination?: { page, limit, total, pages }
 * }
 * 
 * ===========================================
 * DEPENDENCY DIAGRAM
 * ===========================================
 * 
 * Routes ─────────┐
 *                  │
 * Controllers ─────┤
 *                  │
 * Services ────────┼──→ Models
 *                  │
 * Repositories ────┘
 *       │
 *       ↓
 * Database (MongoDB)
 *       │
 *       ↓
 * Cache (Redis)
 *       │
 *       ↓
 * Queue (BullMQ)
 *       │
 *       ↓
 * Events (EventBus)
 * 
 * ===========================================
 * FOLDER STRUCTURE
 * ===========================================
 * 
 * src/
 * ├── config/           # Environment configuration
 * ├── core/             # Core infrastructure
 * │   ├── errors/       # Error classes
 * │   ├── logger/       # Logging system
 * │   └── events/       # Event bus
 * ├── database/         # Database connection & utilities
 * ├── modules/          # Feature modules
 * │   ├── auth/         # Authentication
 * │   ├── user/         # User management
 * │   ├── store/        # Store management
 * │   └── ...           # Other modules
 * ├── middlewares/       # Express middlewares
 * ├── routes/           # API route definitions
 * ├── utils/            # Utility functions
 * ├── types/            # TypeScript types
 * ├── events/           # Event handlers
 * ├── jobs/             # Background jobs
 * ├── queues/           # Queue definitions
 * ├── socket/           # WebSocket handlers
 * ├── emails/           # Email templates & service
 * ├── storage/          # File storage
 * ├── logs/             # Log files
 * └── index.ts          # Entry point
 * 
 * ===========================================
 * PRODUCTION BEST PRACTICES
 * ===========================================
 * 
 * 1. Graceful shutdown handlers
 * 2. Unhandled rejection/exception handlers
 * 3. Health check endpoints
 * 4. Structured logging
 * 5. Request ID tracing
 * 6. Rate limiting
 * 7. Input validation
 * 8. Error standardization
 * 9. Database connection pooling
 * 10. Redis connection management
 * 11. Queue retry logic
 * 12. Event-driven decoupling
 * 13. Cache invalidation strategies
 * 14. Security headers
 * 15. CORS configuration
 * 
 */
