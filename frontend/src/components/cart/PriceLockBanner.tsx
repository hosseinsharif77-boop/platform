/**
 * Price Lock Banner Component
 * 
 * Displays price lock status during checkout.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface PriceLockBannerProps {
  expiresAt: Date;
  onExpired?: () => void;
  className?: string;
}

export function PriceLockBanner({ expiresAt, onExpired, className }: PriceLockBannerProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      return Math.max(0, Math.floor((expiry - now) / 1000));
    };

    setTimeRemaining(calculateTimeRemaining());

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        clearInterval(interval);
        onExpired?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const isUrgent = timeRemaining < 300; // Less than 5 minutes

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border p-4',
        isUrgent ? 'border-warning bg-warning/10' : 'border-info bg-info/10',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <svg
          className={cn('h-5 w-5', isUrgent ? 'text-warning' : 'text-info')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <div>
          <p className={cn('text-sm font-medium', isUrgent ? 'text-warning' : 'text-info')}>
            Price Lock Active
          </p>
          <p className="text-xs text-muted-foreground">
            Your prices are locked for this session
          </p>
        </div>
      </div>

      <Badge
        variant={isUrgent ? 'warning' : 'info'}
        className="font-mono text-lg"
      >
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Badge>
    </div>
  );
}

export default PriceLockBanner;
