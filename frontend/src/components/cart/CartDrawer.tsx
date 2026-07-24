/**
 * Cart Drawer Component
 * 
 * Slide-out cart drawer.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CartItem } from './CartItem';
import { Cart } from '../../features/cart/types';
import { Fade, Slide } from '@/components/motion';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart | null;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  loading?: boolean;
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemove,
  loading,
}: CartDrawerProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <Slide direction="right" className={cn(
        'fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background shadow-xl transition-transform',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-4">
            <h2 className="text-lg font-semibold">
              Shopping Cart ({cart?.itemCount || 0})
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : !cart || cart.items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <svg className="mb-4 h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-medium">Your cart is empty</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add some products to get started
                </p>
                <Button asChild className="mt-4">
                  <Link href="/marketplace" onClick={onClose}>
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {cart.items.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRemove}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart && cart.items.length > 0 && (
            <div className="border-t px-4 py-4">
              {/* Price Changes Warning */}
              {cart.hasPriceChanges && (
                <div className="mb-4 rounded-lg bg-warning/10 p-3 text-sm text-warning">
                  Some prices have changed. Please review your cart.
                </div>
              )}

              {/* Subtotal */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-muted-foreground">Calculated at checkout</span>
                </div>
              </div>

              {/* Total */}
              <div className="mt-4 flex justify-between border-t pt-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold">{formatPrice(cart.subtotal)}</span>
              </div>

              {/* Actions */}
              <div className="mt-4 space-y-2">
                <Button asChild className="w-full">
                  <Link href="/checkout" onClick={onClose}>
                    Proceed to Checkout
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" onClick={onClose}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </Slide>
    </>
  );
}

export default CartDrawer;
