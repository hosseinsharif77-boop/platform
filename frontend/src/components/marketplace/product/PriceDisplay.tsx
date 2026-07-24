/**
 * Price Display Component
 * 
 * Displays product price with live indicator.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { PriceInfo } from '../../features/marketplace/types';

interface PriceDisplayProps {
  price: PriceInfo;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
}

export function PriceDisplay({
  price,
  size = 'md',
  showBadge = true,
  className,
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-baseline gap-2">
        {/* Current Price */}
        <span className={cn('font-bold text-foreground', sizeClasses[size])}>
          {price.formatted}
        </span>

        {/* Original Price */}
        {price.formattedOriginal && (
          <span className="text-sm text-muted-foreground line-through">
            {price.formattedOriginal}
          </span>
        )}

        {/* Discount Badge */}
        {price.discount && price.discount > 0 && (
          <Badge variant="success" className="text-xs">
            -{price.discount}%
          </Badge>
        )}
      </div>

      {/* Live Indicator */}
      {showBadge && price.isLive && (
        <div className="flex items-center gap-2">
          <Badge variant="info" className="text-xs">
            <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-info" />
            Live Price
          </Badge>
          
          {price.lastUpdatedAgo && (
            <span className="text-xs text-muted-foreground">
              Updated {price.lastUpdatedAgo}
            </span>
          )}
        </div>
      )}

      {/* Price Lock Notice */}
      {price.isLocked && price.lockExpiresAt && (
        <div className="flex items-center gap-2 text-xs text-warning">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Price locked until checkout</span>
        </div>
      )}
    </div>
  );
}

export default PriceDisplay;
