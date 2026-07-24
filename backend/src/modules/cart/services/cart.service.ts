/**
 * Cart Service
 * 
 * Business logic for shopping cart operations.
 */

import { Cart, ICart } from '../models';
import { CartItem, CartStatus, CartValidationResult, CartItemValidation } from '../interfaces';
import { Product } from '../../product/models';
import { Store } from '../../../models';
import { cache } from '../../../database/cache';
import { eventBus, Events } from '../../../core/events';
import { NotFoundError, ValidationError, BusinessError } from '../../../core/errors';
import { logger } from '../../../core/logger';

export class CartService {
  private static instance: CartService;
  private cachePrefix = 'cart:';
  private cacheTTL = 1800; // 30 minutes

  private constructor() {}

  static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  /**
   * Get or create cart
   */
  async getCart(userId?: string, sessionId?: string): Promise<ICart> {
    const cart = await Cart.findOrCreate(userId, sessionId);
    
    // Validate prices
    await this.validateCartPrices(cart);
    
    return cart;
  }

  /**
   * Add item to cart
   */
  async addItem(
    userId: string | undefined,
    sessionId: string | undefined,
    productId: string,
    quantity: number
  ): Promise<ICart> {
    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundError('Product', productId);
    }

    // Check stock
    const available = product.currentStock - product.reservedStock;
    if (available < quantity) {
      throw new BusinessError('Insufficient stock');
    }

    // Check product status
    if (product.status !== 'published') {
      throw new BusinessError('Product is not available');
    }

    // Get or create cart
    const cart = await Cart.findOrCreate(userId, sessionId);

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (available < newQuantity) {
        throw new BusinessError('Insufficient stock for requested quantity');
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].currentPrice = product.livePrice || product.basePrice;
      cart.items[existingItemIndex].updatedAt = new Date();
    } else {
      // Add new item
      cart.items.push({
        productId: product._id,
        productName: product.name,
        productSlug: product.slug,
        productImage: product.mainImage?.url,
        storeId: product.storeId,
        quantity,
        unitPrice: product.basePrice,
        currentPrice: product.livePrice || product.basePrice,
        priceValid: true,
        priceChanged: false,
        sku: product.sku,
        inStock: available > 0,
        availableQuantity: available,
        addedAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Group by store
    cart.storeGroups = this.groupByStore(cart.items);

    await cart.save();

    // Invalidate cache
    await this.invalidateCache(cart._id.toString());

    // Emit event
    eventBus.emit('cart.item.added', {
      cartId: cart._id,
      productId,
      quantity,
    });

    logger.info('Item added to cart', {
      cartId: cart._id,
      productId,
      quantity,
    });

    return cart;
  }

  /**
   * Update cart item quantity
   */
  async updateItem(
    cartId: string,
    itemId: string,
    quantity: number,
    userId?: string
  ): Promise<ICart> {
    const cart = await this.getCartById(cartId, userId);
    
    // Find item
    const itemIndex = cart.items.findIndex(
      (item) => item._id?.toString() === itemId
    );

    if (itemIndex === -1) {
      throw new NotFoundError('Cart item', itemId);
    }

    // Validate stock
    const product = await Product.findById(cart.items[itemIndex].productId);
    if (!product) {
      throw new NotFoundError('Product');
    }

    const available = product.currentStock - product.reservedStock;
    if (available < quantity) {
      throw new BusinessError('Insufficient stock');
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].currentPrice = product.livePrice || product.basePrice;
    cart.items[itemIndex].availableQuantity = available;
    cart.items[itemIndex].updatedAt = new Date();

    // Regroup
    cart.storeGroups = this.groupByStore(cart.items);

    await cart.save();

    await this.invalidateCache(cartId);

    return cart;
  }

  /**
   * Remove item from cart
   */
  async removeItem(cartId: string, itemId: string, userId?: string): Promise<ICart> {
    const cart = await this.getCartById(cartId, userId);
    
    const itemIndex = cart.items.findIndex(
      (item) => item._id?.toString() === itemId
    );

    if (itemIndex === -1) {
      throw new NotFoundError('Cart item', itemId);
    }

    // Remove item
    cart.items.splice(itemIndex, 1);

    // Regroup
    cart.storeGroups = this.groupByStore(cart.items);

    await cart.save();

    await this.invalidateCache(cartId);

    return cart;
  }

  /**
   * Clear cart
   */
  async clearCart(cartId: string, userId?: string): Promise<ICart> {
    const cart = await this.getCartById(cartId, userId);
    
    cart.items = [];
    cart.storeGroups = [];
    cart.subtotal = 0;
    cart.shipping = 0;
    cart.tax = 0;
    cart.discount = 0;
    cart.total = 0;
    cart.itemCount = 0;

    await cart.save();

    await this.invalidateCache(cartId);

    return cart;
  }

  /**
   * Validate cart prices
   */
  async validateCartPrices(cart: ICart): Promise<CartValidationResult> {
    const items: CartItemValidation[] = [];
    let priceChanges = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      
      const validation: CartItemValidation = {
        itemId: item._id?.toString() || '',
        productId: item.productId.toString(),
        valid: true,
        errors: [],
        warnings: [],
        currentPrice: product?.livePrice || product?.basePrice || item.currentPrice,
        cartPrice: item.currentPrice,
        inStock: false,
        availableQuantity: 0,
        productStatus: product?.status || 'unknown',
      };

      if (!product) {
        validation.valid = false;
        validation.errors.push('Product not found');
      } else {
        // Check stock
        const available = product.currentStock - product.reservedStock;
        validation.inStock = available > 0;
        validation.availableQuantity = available;
        
        if (available < item.quantity) {
          validation.valid = false;
          validation.errors.push('Insufficient stock');
        }

        // Check price
        const currentPrice = product.livePrice || product.basePrice;
        if (currentPrice !== item.currentPrice) {
          validation.warnings.push('Price has changed');
          priceChanges++;
          
          // Update item
          item.priceChanged = true;
          item.priceDifference = currentPrice - item.currentPrice;
          item.currentPrice = currentPrice;
        }

        // Check status
        if (product.status !== 'published') {
          validation.valid = false;
          validation.errors.push('Product is no longer available');
        }
      }

      items.push(validation);
    }

    // Update cart
    cart.hasPriceChanges = priceChanges > 0;
    cart.lastValidatedAt = new Date();
    await cart.save();

    return {
      valid: items.every((item) => item.valid),
      items,
      summary: {
        totalItems: items.length,
        validItems: items.filter((item) => item.valid).length,
        invalidItems: items.filter((item) => !item.valid).length,
        priceChanges,
      },
    };
  }

  /**
   * Merge guest cart with user cart
   */
  async mergeCarts(userId: string, sessionId: string): Promise<ICart> {
    const guestCart = await Cart.findBySession(sessionId);
    const userCart = await Cart.findByUser(userId) || await Cart.findOrCreate(userId);

    if (guestCart && guestCart.items.length > 0) {
      // Merge items
      for (const guestItem of guestCart.items) {
        const existingIndex = userCart.items.findIndex(
          (item) => item.productId.toString() === guestItem.productId.toString()
        );

        if (existingIndex > -1) {
          // Update quantity
          userCart.items[existingIndex].quantity += guestItem.quantity;
        } else {
          // Add item
          userCart.items.push(guestItem);
        }
      }

      // Mark guest cart as merged
      guestCart.status = CartStatus.MERGED;
      await guestCart.save();
    }

    // Regroup
    userCart.storeGroups = this.groupByStore(userCart.items);
    userCart.userId = userId;

    await userCart.save();

    return userCart;
  }

  /**
   * Get cart by ID
   */
  private async getCartById(cartId: string, userId?: string): Promise<ICart> {
    const query: any = { _id: cartId };
    if (userId) {
      query.userId = userId;
    }

    const cart = await Cart.findOne(query);
    if (!cart) {
      throw new NotFoundError('Cart', cartId);
    }

    return cart;
  }

  /**
   * Group items by store
   */
  private groupByStore(items: CartItem[]): any[] {
    const groups: Record<string, any> = {};

    for (const item of items) {
      const storeId = item.storeId.toString();
      if (!groups[storeId]) {
        groups[storeId] = {
          storeId,
          storeName: item.storeName || 'Unknown Store',
          items: [],
          subtotal: 0,
        };
      }
      groups[storeId].items.push(item);
      groups[storeId].subtotal += item.currentPrice * item.quantity;
    }

    return Object.values(groups);
  }

  /**
   * Invalidate cache
   */
  private async invalidateCache(cartId: string): Promise<void> {
    await cache.del(`${this.cachePrefix}${cartId}`);
  }
}

export const cartService = CartService.getInstance();
export default cartService;
