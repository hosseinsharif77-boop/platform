/**
 * Cart Item Component
 * 
 * Individual cart item display.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuantitySelector } from './QuantitySelector';
import { CartItem as CartItemType } from '../../features/cart/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  showStore?: boolean;
  className?: string;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  showStore = false,
  className,
}: CartItemProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className={cn('flex gap-4 py-4', className)}>
      {/* Image */}
      <Link
        href={`/marketplace/products/${item.productId}`}
        className="flex-shrink-0"
      >
        <div className="h-20 w-20 overflow-hidden rounded-lg bg-muted">
          {item.productImage ? (
            <img
              src={item.productImage}
              alt={item.productName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              No Image
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between">
          <div>
            {/* Store Name */}
            {showStore && item.storeName && (
              <p className="text-xs text-muted-foreground">{item.storeName}</p>
            )}
            
            {/* Product Name */}
            <Link
              href={`/marketplace/products/${item.productId}`}
              className="text-sm font-medium text-foreground hover:text-primary"
            >
              {item.productName}
            </Link>

            {/* SKU */}
            <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(item._id)}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Price & Quantity */}
        <div className="mt-auto flex items-center justify-between">
          {/* Quantity */}
          <QuantitySelector
            value={item.quantity}
            min={1}
            max={item.availableQuantity}
            onChange={(quantity) => onUpdateQuantity(item._id, quantity)}
          />

          {/* Price */}
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">
              {formatPrice(item.currentPrice * item.quantity)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-muted-foreground">
                {formatPrice(item.currentPrice)} each
              </p>
            )}
            
            {/* Price Changed */}
            {item.priceChanged && (
              <Badge variant="warning" className="mt-1 text-xs">
                Price updated
              </Badge>
            )}
            
            {/* Out of Stock */}
            {!item.inStock && (
              <Badge variant="destructive" className="mt-1 text-xs">
                Out of stock
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
