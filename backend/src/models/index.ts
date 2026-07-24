/**
 * Models Index
 * 
 * Central export point for all Mongoose models.
 * 
 * ===========================================
 * COLLECTION RELATIONSHIPS
 * ===========================================
 * 
 * Users
 *   ├── StoreMembers (userId)
 *   ├── Carts (userId)
 *   ├── Orders (userId)
 *   ├── Addresses (userId)
 *   ├── Favorites (userId)
 *   ├── Reviews (userId)
 *   ├── Notifications (userId)
 *   ├── Sessions (userId)
 *   └── RefreshTokens (userId)
 * 
 * Stores
 *   ├── StoreMembers (storeId)
 *   ├── StoreSettings (storeId)
 *   ├── Products (storeId)
 *   ├── Orders (storeId)
 *   ├── PricingRules (storeId)
 *   ├── Coupons (storeId)
 *   ├── Discounts (storeId)
 *   ├── SellerAnalytics (storeId)
 *   └── Currencies (for store settings)
 * 
 * Products
 *   ├── ProductVariants (embedded)
 *   ├── ProductImages (embedded)
 *   ├── PriceHistory (productId)
 *   ├── PriceLocks (productId)
 *   ├── Reviews (productId)
 *   ├── Favorites (productId)
 *   ├── CartItems (productId)
 *   ├── OrderItems (productId)
 *   └── PricingRules (productId)
 * 
 * Orders
 *   ├── OrderItems (orderId)
 *   ├── Payments (orderId)
 *   └── Shipments (orderId)
 * 
 * Categories (self-referencing)
 *   └── Products (categoryId)
 * 
 * Brands
 *   └── Products (brandId)
 * 
 * Currencies
 *   └── ExchangeRates (fromCurrency, toCurrency)
 * 
 * ===========================================
 * INDEX STRATEGY SUMMARY
 * ===========================================
 * 
 * Compound Indexes:
 *   - { storeId, status } - Most common multi-tenant query
 *   - { storeId, createdAt } - Date-sorted lists
 *   - { userId, status } - User-specific queries
 *   - { productId, createdAt } - Product history
 * 
 * Unique Constraints:
 *   - users.email
 *   - stores.slug
 *   - products.storeId + products.seo.slug
 *   - store_members.storeId + store_members.userId
 *   - reviews.productId + reviews.userId
 *   - favorites.userId + favorites.productId
 *   - coupons.storeId + coupons.code
 * 
 * Partial Indexes:
 *   - isDeleted: false (active documents only)
 *   - isDefault: true (default addresses)
 *   - sparse indexes for optional fields
 * 
 * TTL Indexes:
 *   - sessions.expiresAt (auto-cleanup)
 *   - refresh_tokens.expiresAt (auto-cleanup)
 *   - price_locks.expiresAt (auto-cleanup)
 *   - audit_logs.createdAt (1 year retention)
 *   - activity_logs.createdAt (90 days retention)
 *   - notifications.createdAt (90 days retention)
 * 
 * Text Indexes:
 *   - users (firstName, lastName, email)
 *   - products (name, description, tags)
 *   - stores (name, description)
 *   - categories (name, description)
 * 
 * ===========================================
 * SCALABILITY NOTES
 * ===========================================
 * 
 * 1. EMBEDDED DOCUMENTS (1:1, 1:few)
 *    - Product variants, images, specifications
 *    - Order timeline
 *    - Store settings
 *    - User preferences
 * 
 * 2. REFERENCED DOCUMENTS (1:many, many:many)
 *    - Products → Store
 *    - Orders → Store, User
 *    - Reviews → Product, User
 * 
 * 3. DENORMALIZED DATA (read-heavy)
 *    - Product stats (viewCount, orderCount, favoriteCount)
 *    - Store stats (totalProducts, totalOrders, totalRevenue)
 *    - User stats (totalOrders, totalSpent)
 *    - Seller analytics (daily aggregates)
 * 
 * 4. AGGREGATION PIPELINES
 *    - Use for complex queries instead of multiple find operations
 *    - Example: Product search with filters, sorting, faceted results
 * 
 * ===========================================
 * PERFORMANCE NOTES
 * ===========================================
 * 
 * 1. LEAN QUERIES
 *    - Use .lean() for read-only queries
 *    - Reduces memory usage and increases speed
 * 
 * 2. PROJECTION
 *    - Only select needed fields
 *    - Use select() to limit response size
 * 
 * 3. BATCH OPERATIONS
 *    - Use bulkWrite for multiple updates
 *    - Use insertMany for batch inserts
 * 
 * 4. CACHING STRATEGY
 *    - Redis for frequently accessed data
 *    - Cache product listings, categories, settings
 *    - Invalidate on write operations
 * 
 * ===========================================
 */

// ===========================================
// CORE MODELS
// ===========================================

export { User, UserRole, UserStatus } from './schemas/user.schema';
export type { IUser, UserModel } from './schemas/user.schema';

export { Store, StoreStatus, StorePlan } from './schemas/store.schema';
export type { IStore, StoreModel, IStoreSettings } from './schemas/store.schema';

export { StoreMember, StoreMemberRole, StoreMemberStatus } from './schemas/storeMember.schema';
export type { IStoreMember, StoreMemberModel } from './schemas/storeMember.schema';

// ===========================================
// PRODUCT MODELS
// ===========================================

export { Product, ProductStatus, ProductVisibility } from './schemas/product.schema';
export type { IProduct, ProductModel, IProductVariant, IProductImage } from './schemas/product.schema';

export { Category } from './schemas/category.schema';
export type { ICategory, CategoryModel } from './schemas/category.schema';

export { Brand } from './schemas/brand.schema';
export type { IBrand, BrandModel } from './schemas/brand.schema';

// ===========================================
// PRICING MODELS
// ===========================================

export { PricingRule, PriceHistory, PriceLock, PricingRuleType, PricingRuleStatus } from './schemas/pricing.schema';
export type { 
  IPricingRule, 
  IPriceHistory, 
  IPriceLock,
  PricingRuleModel,
  PriceHistoryModel,
  PriceLockModel 
} from './schemas/pricing.schema';

// ===========================================
// CART & ORDER MODELS
// ===========================================

export { Cart } from './schemas/cart.schema';
export type { ICart, CartModel, ICartItem } from './schemas/cart.schema';

export { Order, OrderStatus, PaymentStatus, PaymentMethod, ShipmentStatus } from './schemas/order.schema';
export type { 
  IOrder, 
  IOrderItem,
  IPayment, 
  IShipment,
  OrderModel 
} from './schemas/order.schema';

// ===========================================
// CURRENCY MODELS
// ===========================================

export { Currency, ExchangeRate } from './schemas/currency.schema';
export type { ICurrency, CurrencyModel, IExchangeRate, ExchangeRateModel } from './schemas/currency.schema';

// ===========================================
// PROMOTION MODELS
// ===========================================

export { Coupon, CouponType } from './schemas/coupon.schema';
export type { ICoupon, CouponModel } from './schemas/coupon.schema';

export { Discount, DiscountType } from './schemas/coupon.schema';
export type { IDiscount } from './schemas/coupon.schema';

// ===========================================
// USER-RELATED MODELS
// ===========================================

export { Address, AddressType } from './schemas/address.schema';
export type { IAddress, AddressModel } from './schemas/address.schema';

export { Review, ReviewStatus } from './schemas/review.schema';
export type { IReview, ReviewModel } from './schemas/review.schema';

export { Favorite } from './schemas/favorite.schema';
export type { IFavorite, FavoriteModel } from './schemas/favorite.schema';

export { Notification, NotificationType, NotificationChannel } from './schemas/notification.schema';
export type { INotification, NotificationModel } from './schemas/notification.schema';

// ===========================================
// AUTH MODELS
// ===========================================

export { Session, RefreshToken } from './schemas/auth.schema';
export type { ISession, SessionModel, IRefreshToken, RefreshTokenModel } from './schemas/auth.schema';

// ===========================================
// ANALYTICS MODELS
// ===========================================

export { SellerAnalytics, CustomerAnalytics } from './schemas/analytics.schema';
export type { ISellerAnalytics, SellerAnalyticsModel, ICustomerAnalytics, CustomerAnalyticsModel } from './schemas/analytics.schema';

// ===========================================
// LOG MODELS
// ===========================================

export { AuditLog, AuditAction, ActivityLog } from './schemas/auditLog.schema';
export type { IAuditLog, AuditLogModel, IActivityLog, ActivityLogModel } from './schemas/auditLog.schema';

// ===========================================
// SETTINGS MODELS
// ===========================================

export { SystemSettings, StoreSettings } from './schemas/settings.schema';
export type { ISystemSettings, SystemSettingsModel, IStoreSettings, StoreSettingsModel } from './schemas/settings.schema';

// ===========================================
// PLUGINS
// ===========================================

export { auditPlugin, softDeletePlugin, paginationPlugin, toJSONPlugin } from './plugins';
