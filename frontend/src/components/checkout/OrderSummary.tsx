/**
 * Order Summary Component
 * 
 * Displays order summary with locked prices.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CartItem } from '../../features/cart/types';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency?: string;
  showPrices?: boolean;
  className?: string;
}

export function OrderSummary({
  items,
  subtotal,
  shipping,
  tax,
  discount,
  total,
  currency = 'USD',
  showPrices = true,
  className,
}: OrderSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="flex items-start gap-3">
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-muted">
                {item.productImage ? (
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No img
                  </div>
                )}
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.productName}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.currentPrice)} × {item.quantity}
                  </p>
                  {item.priceChanged && (
                    <Badge variant="warning" className="text-[10px]">
                      Updated
                    </Badge>
                  )}
                </div>
              </div>
              {showPrices && (
                <p className="text-sm font-medium">
                  {formatPrice(item.currentPrice * item.quantity)}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
          </div>
          {tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
          )}
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-success">-{formatPrice(discount)}</span>
            </div>
          )}
        </div>

        {/* Grand Total */}
        <div className="flex justify-between border-t pt-4">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-lg font-bold">{formatPrice(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderSummary;
