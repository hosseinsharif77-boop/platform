/**
 * Product Management Module - Architecture Documentation
 * 
 * Live Price Platform - Product Management
 * 
 * ===========================================
 * MODULE OVERVIEW
 * ===========================================
 * 
 * The Product Module manages all product-related operations including:
 * - Product CRUD operations
 * - Image management
 * - Inventory tracking
 * - Integration with Pricing Engine
 * - Multi-tenant support (Store-based)
 * 
 * Key Design Decisions:
 * 1. Products NEVER calculate prices internally
 * 2. All prices come from the Pricing Engine
 * 3. Store-scoped isolation for multi-tenancy
 * 4. Soft delete for data preservation
 * 5. Denormalized stats for read performance
 * 
 * ===========================================
 * PRODUCT STATUS FLOW
 * ===========================================
 * 
 * ┌─────────┐     ┌─────────────┐     ┌───────────┐
 * │  Draft  │────►│   Pending   │────►│ Published │
 * └─────────┘     │   Review    │     └───────────┘
 *                 └─────────────┘           │
 *                       │                   │
 *                       ▼                   ▼
 *                 ┌───────────┐       ┌───────────┐
 *                 │  Rejected │       │  Hidden   │
 *                 └───────────┘       └───────────┘
 *                                           │
 *                                           ▼
 *                                     ┌───────────┐
 *                                     │ Archived  │
 *                                     └───────────┘
 * 
 * ===========================================
 * INVENTORY MANAGEMENT
 * ===========================================
 * 
 * Stock Calculation:
 * available = currentStock - reservedStock
 * 
 * Status Rules:
 * - Out of Stock: available <= 0
 * - Low Stock: available <= minimumStock
 * - In Stock: available > minimumStock
 * 
 * ===========================================
 * PRICE INTEGRATION
 * ===========================================
 * 
 * Product stores:
 * - basePrice: Seller's base price
 * - priceType: 'static' | 'dynamic'
 * - livePrice: Current calculated price (from Pricing Engine)
 * - lastPriceUpdate: Timestamp of last price sync
 * 
 * Price Flow:
 * 1. Seller sets basePrice
 * 2. Pricing Engine calculates livePrice
 * 3. Customer sees livePrice
 * 
 * ===========================================
 * FOLDER STRUCTURE
 * ===========================================
 * 
 * modules/product/
 * ├── controllers/      # Request handlers
 * ├── services/         # Business logic
 * ├── repositories/     # Data access
 * ├── models/           # Mongoose schemas
 * ├── validators/       # Zod schemas
 * ├── routes/           # Express routes
 * ├── dto/              # Data transfer objects
 * ├── mappers/          # Object mappers
 * ├── interfaces/       # TypeScript interfaces
 * └── utils/            # Helper functions
 * 
 * features/products/
 * ├── components/       # UI components
 * ├── forms/            # Form components
 * ├── tables/           # Table components
 * ├── cards/            # Card components
 * ├── hooks/            # React hooks
 * ├── services/         # API services
 * ├── types/            # TypeScript types
 * └── utils/            # Utility functions
 * 
 * ===========================================
 * API ENDPOINTS
 * ===========================================
 * 
 * Products:
 * GET    /api/v1/products              - List products
 * GET    /api/v1/products/:id          - Get product
 * POST   /api/v1/products              - Create product
 * PUT    /api/v1/products/:id          - Update product
 * DELETE /api/v1/products/:id          - Delete product
 * 
 * Product Operations:
 * POST   /api/v1/products/:id/publish  - Publish product
 * POST   /api/v1/products/:id/archive  - Archive product
 * POST   /api/v1/products/:id/duplicate - Duplicate product
 * 
 * Inventory:
 * PUT    /api/v1/products/:id/inventory - Update inventory
 * POST   /api/v1/products/:id/reserve   - Reserve stock
 * POST   /api/v1/products/:id/release   - Release stock
 * 
 * Images:
 * POST   /api/v1/products/:id/images    - Upload images
 * DELETE /api/v1/products/:id/images/:imageId - Delete image
 * PUT    /api/v1/products/:id/images/reorder - Reorder images
 * 
 * Bulk Operations:
 * POST   /api/v1/products/bulk/delete    - Bulk delete
 * POST   /api/v1/products/bulk/publish   - Bulk publish
 * POST   /api/v1/products/bulk/archive   - Bulk archive
 * 
 * ===========================================
 * REPOSITORY PATTERN
 * ===========================================
 * 
 * ProductRepository:
 * - findById(id)
 * - findBySlug(slug, storeId)
 * - findByStore(storeId, filters)
 * - findBySKU(sku, storeId)
 * - search(query, storeId)
 * - create(data)
 * - update(id, data)
 * - delete(id)
 * - count(storeId, filters)
 * - aggregate(pipeline)
 * 
 * ===========================================
 * SERVICE LAYER
 * ===========================================
 * 
 * ProductService:
 * - getProducts(storeId, query)
 * - getProduct(id)
 * - getProductBySlug(slug, storeId)
 * - createProduct(data, userId)
 * - updateProduct(id, data, userId)
 * - deleteProduct(id, userId)
 * - publishProduct(id, userId)
 * - archiveProduct(id, userId)
 * - duplicateProduct(id, userId)
 * - updateInventory(id, data, userId)
 * - reserveStock(id, quantity)
 * - releaseStock(id, quantity)
 * - uploadImages(id, files)
 * - deleteImage(id, imageId)
 * - reorderImages(id, imageIds)
 * - bulkDelete(ids, userId)
 * - bulkPublish(ids, userId)
 * - bulkArchive(ids, userId)
 * - searchProducts(query, storeId)
 * 
 * ===========================================
 * VALIDATION STRATEGY
 * ===========================================
 * 
 * Create Product:
 * - name: required, 3-200 chars
 * - slug: auto-generated from name
 * - description: optional, max 5000 chars
 * - categoryId: required, valid ObjectId
 * - brandId: optional, valid ObjectId
 * - sku: required, unique per store
 * - priceType: required, 'static' | 'dynamic'
 * - basePrice: required if static, min 0
 * - status: optional, defaults to 'draft'
 * 
 * Update Product:
 * - All fields optional
 * - sku uniqueness checked if changed
 * 
 * Update Inventory:
 * - currentStock: required, min 0
 * - minimumStock: optional, min 0
 * 
 * ===========================================
 * SCALABILITY CONSIDERATIONS
 * ===========================================
 * 
 * 1. Database:
 *    - Compound indexes for common queries
 *    - Text index for search
 *    - Partial indexes for active products
 * 
 * 2. Caching:
 *    - Product list cache (TTL: 2 min)
 *    - Single product cache (TTL: 5 min)
 *    - Invalidated on write operations
 * 
 * 3. Search:
 *    - MongoDB text search for basic needs
 *    - Algolia/Elasticsearch for advanced search
 * 
 * 4. Images:
 *    - CDN for image delivery
 *    - Lazy loading for gallery
 *    - Image optimization on upload
 * 
 */
