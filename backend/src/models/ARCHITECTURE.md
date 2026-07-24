/**
 * Database Architecture Documentation
 * 
 * Live Price Platform - MongoDB Schema Design
 * 
 * ===========================================
 * DESIGN PRINCIPLES
 * ===========================================
 * 
 * 1. REFERENTIAL INTEGRITY
 *    - Use ObjectId references for relationships
 *    - Virtual populate for read-heavy queries
 *    - Cascade delete policies defined at application level
 * 
 * 2. MULTI-TENANT ISOLATION
 *    - Every seller-owned collection has storeId
 *    - Compound indexes include storeId for query isolation
 *    - Middleware enforces store-level access control
 * 
 * 3. AUDIT TRAIL
 *    - All collections include audit plugin
 *    - Tracks createdBy, updatedBy, createdAt, updatedAt
 *    - Soft delete preserves historical data
 * 
 * 4. PERFORMANCE
 *    - Compound indexes for common query patterns
 *    - Partial indexes for filtered queries
 *    - Text indexes for search functionality
 *    - Sparse indexes for optional fields
 * 
 * 5. SCALABILITY
 *    - Embedded documents for 1:1 and 1:few relationships
 *    - References for 1:many and many:many relationships
 *    - Bucket pattern for time-series data (PriceHistory)
 *    - Extended reference pattern for frequently accessed data
 * 
 * ===========================================
 * NAMING CONVENTIONS
 * ===========================================
 * 
 * Collections: PascalCase, plural (e.g., Users, Products, OrderItems)
 * Fields: camelCase (e.g., firstName, createdAt)
 * Indexes: descriptive names (e.g., idx_product_store_status)
 * Virtuals: prefixed with 'v_' (e.g., v_fullName)
 * Methods: camelCase (e.g., findBySlug)
 * Statics: PascalCase (e.g., FindByStore)
 * 
 * ===========================================
 * FOLDER STRUCTURE
 * ===========================================
 * 
 * src/
 *   models/
 *     plugins/
 *       audit.ts          # Audit trail plugin
 *       softDelete.ts     # Soft delete plugin
 *       pagination.ts     # Pagination plugin
 *       toJSON.ts         # JSON serialization
 *     schemas/
 *       user.schema.ts
 *       store.schema.ts
 *       product.schema.ts
 *       ... (one per collection)
 *     index.ts            # Model exports
 * 
 * ===========================================
 * ER DIAGRAM RELATIONSHIPS
 * ===========================================
 * 
 * Users ──────< StoreMembers >────── Stores
 *   │                                  │
 *   │                                  ├──< Products
 *   │                                  │     ├──< ProductVariants
 *   │                                  │     ├──< ProductImages
 *   │                                  │     └──< Inventory
 *   │                                  ├──< Orders
 *   │                                  │     ├──< OrderItems
 *   │                                  │     ├──< Payments
 *   │                                  │     └──< Shipments
 *   │                                  ├──< PricingRules
 *   │                                  └──< StoreSettings
 *   │
 *   ├──< Carts ────────< CartItems
 *   ├──< Orders (buyer)
 *   ├──< Addresses
 *   ├──< Favorites
 *   ├──< Reviews
 *   └──< Notifications
 * 
 * Products ──< PriceHistory
 * Products ──< PriceLocks
 * Products ──< Reviews
 * Products ──< Favorites
 * Products ──< OrderItems
 * Products ──< CartItems
 * 
 * Categories ──< Categories (self-referencing)
 * Categories ──< Products
 * 
 * Brands ──< Products
 * 
 * Currencies ──< ExchangeRates
 * Currencies ──< Products
 * Currencies ──< Orders
 * 
 * Orders ──< OrderItems
 * Orders ──< Payments
 * Orders ──< Shipments
 * Orders ──< Coupons (via discount field)
 * 
 * Coupons ──< Orders
 * Discounts ──< Products
 * Discounts ──< Orders
 * 
 */
