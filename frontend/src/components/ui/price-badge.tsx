/**
 * PriceBadge Component
 * 
 * Displays price with optional discount, currency, and animations.
 * Designed for premium marketplace interfaces.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const priceBadgeVariants = cva(
  'inline-flex items-center gap-1.5 font-medium',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        success: 'text-success',
        danger: 'text-danger',
        muted: 'text-muted-foreground',
        accent: 'text-accent',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
      },
      decoration: {
        none: '',
        strikethrough: 'line-through',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      decoration: 'none',
    },
  }
);

export interface PriceBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>,
    VariantProps<typeof priceBadgeVariants> {
  price: number;
  compareAtPrice?: number;
  currency?: string;
  showCurrency?: boolean;
  locale?: string;
  animate?: boolean;
}

const PriceBadge = React.forwardRef<HTMLSpanElement, PriceBadgeProps>(
  (
    {
      price,
      compareAtPrice,
      currency = 'USD',
      showCurrency = true,
      locale = 'en-US',
      animate = false,
      variant,
      size,
      decoration,
      className,
      ...props
    },
    ref
  ) => {
    const formattedPrice = new Intl.NumberFormat(locale, {
      style: showCurrency ? 'currency' : 'decimal',
      currency: showCurrency ? currency : undefined,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

    const formattedCompareAt = compareAtPrice
      ? new Intl.NumberFormat(locale, {
          style: showCurrency ? 'currency' : 'decimal',
          currency: showCurrency ? currency : undefined,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(compareAtPrice)
      : null;

    const discount = compareAtPrice
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

    return (
      <span ref={ref} className={cn('inline-flex items-center gap-2', className)} {...props}>
        <span
          className={cn(
            priceBadgeVariants({ variant, size, decoration }),
            animate && 'transition-all duration-300'
          )}
        >
          {formattedPrice}
        </span>

        {formattedCompareAt && (
          <span className="text-sm text-muted-foreground line-through">
            {formattedCompareAt}
          </span>
        )}

        {discount && discount > 0 && (
          <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
            -{discount}%
          </span>
        )}
      </span>
    );
  }
);
PriceBadge.displayName = 'PriceBadge';

export { PriceBadge, priceBadgeVariants };
