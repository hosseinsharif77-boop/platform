/**
 * Event Bus
 * 
 * In-memory event bus for decoupled communication between modules.
 * Supports async event handlers.
 */

export type EventHandler<T = any> = (data: T) => Promise<void> | void;

export interface EventBusInterface {
  emit<T>(event: string, data: T): void;
  on<T>(event: string, handler: EventHandler<T>): void;
  off<T>(event: string, handler: EventHandler<T>): void;
  once<T>(event: string, handler: EventHandler<T>): void;
}

class EventBus implements EventBusInterface {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  /**
   * Emit an event
   */
  emit<T>(event: string, data: T): void {
    const eventHandlers = this.handlers.get(event);
    if (!eventHandlers) return;

    eventHandlers.forEach(async (handler) => {
      try {
        await handler(data);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }

  /**
   * Register an event handler
   */
  on<T>(event: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  /**
   * Remove an event handler
   */
  off<T>(event: string, handler: EventHandler<T>): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.delete(handler);
    }
  }

  /**
   * Register a one-time event handler
   */
  once<T>(event: string, handler: EventHandler<T>): void {
    const onceHandler: EventHandler<T> = async (data) => {
      await handler(data);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }

  /**
   * Remove all handlers for an event
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.handlers.delete(event);
    } else {
      this.handlers.clear();
    }
  }

  /**
   * Get all registered events
   */
  getRegisteredEvents(): string[] {
    return Array.from(this.handlers.keys());
  }
}

// Singleton instance
export const eventBus = new EventBus();

// Event names
export const Events = {
  // User events
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  USER_LOGIN: 'user.login',
  USER_LOGOUT: 'user.logout',
  USER_PASSWORD_CHANGED: 'user.password.changed',
  USER_EMAIL_VERIFIED: 'user.email.verified',

  // Store events
  STORE_CREATED: 'store.created',
  STORE_UPDATED: 'store.updated',
  STORE_DELETED: 'store.deleted',
  STORE_STATUS_CHANGED: 'store.status.changed',
  STORE_MEMBER_ADDED: 'store.member.added',
  STORE_MEMBER_REMOVED: 'store.member.removed',

  // Product events
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  PRODUCT_STATUS_CHANGED: 'product.status.changed',

  // Price events
  PRICE_UPDATED: 'price.updated',
  PRICE_LOCKED: 'price.locked',
  PRICE_HISTORY_RECORDED: 'price.history.recorded',

  // Order events
  ORDER_CREATED: 'order.created',
  ORDER_PAID: 'order.paid',
  ORDER_SHIPPED: 'order.shipped',
  ORDER_DELIVERED: 'order.delivered',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_REFUNDED: 'order.refunded',

  // Inventory events
  INVENTORY_LOW: 'inventory.low',
  INVENTORY_OUT: 'inventory.out',
  INVENTORY_UPDATED: 'inventory.updated',

  // Notification events
  NOTIFICATION_CREATED: 'notification.created',
  NOTIFICATION_SENT: 'notification.sent',

  // System events
  SYSTEM_SETTING_CHANGED: 'system.setting.changed',
  CACHE_INVALIDATED: 'cache.invalidated',
} as const;

export default eventBus;
