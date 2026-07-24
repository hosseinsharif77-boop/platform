/**
 * LiveBadge Component
 * 
 * Shows live status with animated indicator.
 * Used for real-time updates, live prices, and active states.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const liveBadgeVariants = cva(
  'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary',
        success: 'bg-success/10 text-success',
        danger: 'bg-danger/10 text-danger',
        warning: 'bg-warning/10 text-warning',
        info: 'bg-info/10 text-info',
        muted: 'bg-muted text-muted-foreground',
      },
      pulse: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      pulse: true,
    },
  }
);

export interface LiveBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof liveBadgeVariants> {
  label: string;
  showDot?: boolean;
}

const LiveBadge = React.forwardRef<HTMLSpanElement, LiveBadgeProps>(
  ({ label, showDot = true, variant, pulse, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(liveBadgeVariants({ variant, pulse }), className)}
        {...props}
      >
        {showDot && (
          <span className="relative flex h-2 w-2">
            {pulse && (
              <span
                className={cn(
                  'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                  variant === 'success' && 'bg-success',
                  variant === 'danger' && 'bg-danger',
                  variant === 'warning' && 'bg-warning',
                  variant === 'info' && 'bg-info',
                  variant === 'muted' && 'bg-muted-foreground',
                  (!variant || variant === 'default') && 'bg-primary'
                )}
              />
            )}
            <span
              className={cn(
                'relative inline-flex h-2 w-2 rounded-full',
                variant === 'success' && 'bg-success',
                variant === 'danger' && 'bg-danger',
                variant === 'warning' && 'bg-warning',
                variant === 'info' && 'bg-info',
                variant === 'muted' && 'bg-muted-foreground',
                (!variant || variant === 'default') && 'bg-primary'
              )}
            />
          </span>
        )}
        {label}
      </span>
    );
  }
);
LiveBadge.displayName = 'LiveBadge';

export { LiveBadge, liveBadgeVariants };
