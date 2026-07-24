/**
 * Event Handlers
 * 
 * Event handlers for decoupled module communication.
 */

import { eventBus, Events } from '../../core/events';
import { logger } from '../../core/logger';
import { getEmailQueue, getNotificationQueue, getAnalyticsQueue } from '../../queues';

/**
 * Initialize all event handlers
 */
export const initializeEventHandlers = (): void => {
  // ===========================================
  // USER EVENTS
  // ===========================================

  eventBus.on(Events.USER_CREATED, async (data) => {
    logger.info('User created event', { userId: data.user._id });
    
    // Send welcome email
    await getEmailQueue().add('send-welcome', {
      to: data.user.email,
      template: 'welcome',
      data: { name: data.user.firstName },
    });

    // Track analytics
    await getAnalyticsQueue().add('track-event', {
      event: 'user.registered',
      userId: data.user._id,
    });
  });

  eventBus.on(Events.USER_LOGIN, async (data) => {
    logger.info('User login event', { userId: data.userId });
    
    await getAnalyticsQueue().add('track-event', {
      event: 'user.login',
      userId: data.userId,
    });
  });

  // ===========================================
  // STORE EVENTS
  // ===========================================

  eventBus.on(Events.STORE_CREATED, async (data) => {
    logger.info('Store created event', { storeId: data.store._id });
    
    // Notify admin
    await getNotificationQueue().add('send-notification', {
      type: 'system',
      title: 'New Store Created',
      message: `New store "${data.store.name}" has been created`,
      userId: data.store.ownerId,
    });
  });

  eventBus.on(Events.STORE_STATUS_CHANGED, async (data) => {
    logger.info('Store status changed', { storeId: data.storeId, status: data.status });
    
    // Send email notification
    await getEmailQueue().add('send-notification', {
      to: data.ownerEmail,
      template: 'store-status-change',
      data: { storeName: data.storeName, status: data.status },
    });
  });

  // ===========================================
  // PRODUCT EVENTS
  // ===========================================

  eventBus.on(Events.PRODUCT_CREATED, async (data) => {
    logger.info('Product created event', { productId: data.product._id });
    
    await getAnalyticsQueue().add('track-event', {
      event: 'product.created',
      productId: data.product._id,
      storeId: data.product.storeId,
    });
  });

  // ===========================================
  // ORDER EVENTS
  // ===========================================

  eventBus.on(Events.ORDER_CREATED, async (data) => {
    logger.info('Order created event', { orderId: data.order._id });
    
    // Send confirmation email
    await getEmailQueue().add('send-order-confirmation', {
      to: data.order.userEmail,
      template: 'order-confirmation',
      data: { order: data.order },
    });

    // Notify seller
    await getNotificationQueue().add('send-notification', {
      type: 'order',
      title: 'New Order',
      message: `New order #${data.order.orderNumber}`,
      userId: data.order.storeOwnerId,
    });

    await getAnalyticsQueue().add('track-event', {
      event: 'order.created',
      orderId: data.order._id,
      storeId: data.order.storeId,
      amount: data.order.total,
    });
  });

  eventBus.on(Events.ORDER_PAID, async (data) => {
    logger.info('Order paid event', { orderId: data.orderId });
    
    await getEmailQueue().add('send-payment-confirmation', {
      to: data.userEmail,
      template: 'payment-confirmation',
      data: { order: data.order },
    });

    await getAnalyticsQueue().add('track-event', {
      event: 'order.paid',
      orderId: data.orderId,
      amount: data.amount,
    });
  });

  // ===========================================
  // PRICE EVENTS
  // ===========================================

  eventBus.on(Events.PRICE_UPDATED, async (data) => {
    logger.info('Price updated event', { productId: data.productId });
    
    await getAnalyticsQueue().add('track-event', {
      event: 'price.updated',
      productId: data.productId,
      oldPrice: data.oldPrice,
      newPrice: data.newPrice,
    });
  });

  // ===========================================
  // SYSTEM EVENTS
  // ===========================================

  eventBus.on(Events.CACHE_INVALIDATED, async (data) => {
    logger.info('Cache invalidated', { pattern: data.pattern });
  });

  logger.info('✅ Event handlers initialized');
};

export default initializeEventHandlers;
