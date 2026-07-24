/**
 * Price Changed Dialog Component
 * 
 * Dialog to notify users of price changes.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PriceChangedItem {
  productName: string;
  oldPrice: number;
  newPrice: number;
  quantity: number;
}

interface PriceChangedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  items: PriceChangedItem[];
  currency?: string;
}

export function PriceChangedDialog({
  isOpen,
  onClose,
  onConfirm,
  items,
  currency = 'USD',
}: PriceChangedDialogProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  const totalDifference = items.reduce((sum, item) => {
    return sum + (item.newPrice - item.oldPrice) * item.quantity;
  }, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Prices Have Changed</DialogTitle>
          <DialogDescription>
            Some items in your cart have been updated with new prices.
            Please review the changes below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">{item.productName}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(item.oldPrice)}
                  </span>
                  <span className="text-sm font-medium">
                    {formatPrice(item.newPrice)}
                  </span>
                  <Badge
                    variant={item.newPrice > item.oldPrice ? 'destructive' : 'success'}
                    className="text-xs"
                  >
                    {item.newPrice > item.oldPrice ? '+' : ''}
                    {formatPrice((item.newPrice - item.oldPrice) * item.quantity)}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
            </div>
          ))}

          {/* Total Difference */}
          <div className={cn(
            'flex items-center justify-between rounded-lg p-4',
            totalDifference > 0 ? 'bg-destructive/10' : 'bg-success/10'
          )}>
            <span className="font-medium">Total Change</span>
            <span
              className={cn(
                'font-bold',
                totalDifference > 0 ? 'text-destructive' : 'text-success'
              )}
            >
              {totalDifference > 0 ? '+' : ''}{formatPrice(totalDifference)}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Review Cart
          </Button>
          <Button onClick={onConfirm}>
            Continue with Updated Prices
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PriceChangedDialog;
