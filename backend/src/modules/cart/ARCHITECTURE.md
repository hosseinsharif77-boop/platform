/**
 * Cart and Checkout Module - Architecture Documentation
 * 
 * Live Price Platform - Cart & Checkout with Price Lock
 * 
 * ===========================================
 * MODULE OVERVIEW
 * ===========================================
 * 
 * The Cart and Checkout module handles:
 * - Shopping cart management
 * - Price validation and locking
 * - Checkout process
 * - Address management
 * - Shipping preparation
 * 
 * Key Design Decisions:
 * 1. Prices are validated on every cart operation
 * 2. Prices are locked when checkout begins
 * 3. Lock expires after 15 minutes
 * 4. Guest carts merge with user carts on login
 * 5. Stock is validated in real-time
 * 
 * ===========================================
 * CART FLOW
 * ===========================================
 * 
 * ┌─────────────────────────────────────────────┐
 * │              SHOPPING CART                  │
 * ├─────────────────────────────────────────────┤
 * │                                             │
 * │  1. Add Item                                │
 * │     ↓                                       │
 * │  2. Validate Product                        │
 * │     - Exists?                               │
 * │     - In Stock?                             │
 * │     - Price Current?                        │
 * │     ↓                                       │
 * │  3. Update Cart                             │
 * │     - Recalculate Totals                    │
 * │     - Apply Store Grouping                  │
 * │     ↓                                       │
 * │  4. Display Cart                            │
 * │     - Show Current Prices                   │
 * │     - Show Price Changes (if any)           │
 * │     - Require Confirmation                  │
 * │                                             │
 * └─────────────────────────────────────────────┘
 * 
 * ===========================================
 * PRICE LOCK FLOW
 * ===========================================
 * 
 * ┌─────────────────────────────────────────────┐
 * │              CHECKOUT START                 │
 * ├─────────────────────────────────────────────┤
 * │                                             │
 * │  1. Validate Cart                           │
 * │     - All items still available?            │
 * │     - Prices still valid?                   │
 * │     ↓                                       │
 * │  2. Lock Prices                             │
 * │     - Create PriceLock for each item        │
 *     - Set expiration (15 min)                │
 *     - Store in Redis + Database               │
 *     ↓                                       │
 * │  3. Checkout Process                        │
 * │     - Use locked prices                     │
 *     - Timer countdown                        │
 *     ↓                                       │
 * │  4. Complete or Expire                      │
 * │     - Complete: Unlock, create order        │
 *     - Expire: Unlock, notify user            │
 *                                             │
 * └─────────────────────────────────────────────┘
 * 
 * ===========================================
 * CHECKOUT STEPS
 * ===========================================
 * 
 * Step 1: Customer Information
 * - Email
 * - Phone
 * - Name
 * 
 * Step 2: Shipping Address
 * - Select existing
 * - Create new
 * 
 * Step 3: Shipping Method
 * - Standard
 * - Express
 * - Pickup
 * 
 * Step 4: Order Summary
 * - Products with locked prices
 * - Subtotal
 * - Shipping
 * - Tax
 * - Total
 * 
 * Step 5: Payment Preparation
 * - Price verification
 * - Redirect to payment (future)
 * 
 * ===========================================
 * DATABASE MODELS
 * ===========================================
 * 
 * Cart
 * - userId / sessionId (guest)
 * - items[]
 * - totals
 * - status
 * 
 * CartItem
 * - productId
 * - quantity
 * - price (at time of add)
 * - currentPrice (live)
 * 
 * CheckoutSession
 * - userId
 * - cartId
 * - step
 * - shippingAddress
 * - shippingMethod
 * - priceLockId
 * - status
 * 
 * PriceLock
 * - userId
 * - items[]
 * - lockedAt
 * - expiresAt
 * - isActive
 * 
 * ===========================================
 * FOLDER STRUCTURE
 * ===========================================
 * 
 * modules/cart/
 * ├── controllers/      # Request handlers
 * ├── services/         # Business logic
 * ├── repositories/     # Data access
 * ├── models/           # Mongoose schemas
 * ├── validators/       # Zod schemas
 * ├── routes/           # Express routes
 * └── interfaces/       # TypeScript types
 * 
 * features/cart/
 * ├── components/       # Cart UI components
 * ├── hooks/            # React hooks
 * ├── services/         # API services
 * └── types/            # TypeScript types
 * 
 * features/checkout/
 * ├── components/       # Checkout UI components
 * ├── hooks/            # React hooks
 * ├── services/         # API services
 * └── types/            # TypeScript types
 * 
 * components/cart/      # Shared cart components
 * components/checkout/  # Shared checkout components
 * 
 * ===========================================
 * API ENDPOINTS
 * ===========================================
 * 
 * Cart:
 * GET    /api/v1/cart                 - Get cart
 * POST   /api/v1/cart/items           - Add item
 * PUT    /api/v1/cart/items/:itemId   - Update item
 * DELETE /api/v1/cart/items/:itemId   - Remove item
 * DELETE /api/v1/cart                  - Clear cart
 * POST   /api/v1/cart/validate        - Validate cart
 * POST   /api/v1/cart/merge           - Merge guest cart
 * 
 * Price Lock:
 * POST   /api/v1/checkout/lock        - Lock prices
 * DELETE /api/v1/checkout/lock/:lockId - Unlock
 * GET    /api/v1/checkout/lock/status - Check lock status
 * 
 * Checkout:
 * GET    /api/v1/checkout/session     - Get session
 * POST   /api/v1/checkout/session     - Create session
 * PUT    /api/v1/checkout/session     - Update session
 * POST   /api/v1/checkout/preview     - Preview order
 * 
 * Addresses:
 * GET    /api/v1/addresses            - List addresses
 * POST   /api/v1/addresses            - Create address
 * PUT    /api/v1/addresses/:id        - Update address
 * DELETE /api/v1/addresses/:id        - Delete address
 * PUT    /api/v1/addresses/:id/default - Set default
 * 
 */
