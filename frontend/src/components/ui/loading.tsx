/**
 * Loading Components
 * 
 * Reusable loading indicators for the Live Price Platform.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// ===========================================
// SPINNER
// ===========================================

const spinnerVariants = cva(
  'animate-spin rounded-full border-current border-solid border-t-transparent',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 border-2',
        md: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-[3px]',
        xl: 'h-12 w-12 border-4',
      },
      variant: {
        primary: 'text-primary',
        secondary: 'text-secondary-foreground',
        muted: 'text-muted-foreground',
        white: 'text-white',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size, variant, className, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({ size, variant }), className)}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
);
Spinner.displayName = 'Spinner';

// ===========================================
// SKELETON
// ===========================================

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'rectangular', width, height, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-muted',
          variant === 'text' && 'h-4 w-full rounded',
          variant === 'circular' && 'rounded-full',
          variant === 'rectangular' && 'rounded-md',
          className
        )}
        style={{ width, height }}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

// ===========================================
// PRICE LOADING
// ===========================================

export interface PriceLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
}

const PriceLoading = React.forwardRef<HTMLDivElement, PriceLoadingProps>(
  ({ width = '80px', className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('inline-flex items-center gap-2', className)}
      {...props}
    >
      <Skeleton variant="text" width={width} height={24} />
      <Skeleton variant="circular" width={16} height={16} />
    </div>
  )
);
PriceLoading.displayName = 'PriceLoading';

// ===========================================
// CARD SKELETON
// ===========================================

export interface CardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  showImage?: boolean;
  lines?: number;
}

const CardSkeleton = React.forwardRef<HTMLDivElement, CardSkeletonProps>(
  ({ showImage = true, lines = 3, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border p-4', className)}
      {...props}
    >
      {showImage && (
        <Skeleton className="mb-4 aspect-square w-full rounded-md" />
      )}
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="mb-2 h-4 w-1/2" />
      {lines > 2 && <Skeleton className="mb-2 h-4 w-full" />}
      {lines > 3 && <Skeleton className="h-4 w-2/3" />}
    </div>
  )
);
CardSkeleton.displayName = 'CardSkeleton';

// ===========================================
// PRODUCT CARD SKELETON
// ===========================================

export const ProductCardSkeleton: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => (
  <CardSkeleton
    showImage
    lines={4}
    className={cn('overflow-hidden', className)}
    {...props}
  />
);
ProductCardSkeleton.displayName = 'ProductCardSkeleton';

// ===========================================
// TABLE SKELETON
// ===========================================

export interface TableSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  columns?: number;
}

const TableSkeleton = React.forwardRef<HTMLDivElement, TableSkeletonProps>(
  ({ rows = 5, columns = 4, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('space-y-3', className)}
      {...props}
    >
      {/* Header */}
      <div className="flex gap-4">
        {[...Array(columns)].map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4">
          {[...Array(columns)].map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
);
TableSkeleton.displayName = 'TableSkeleton';

// ===========================================
// PAGE SKELETON
// ===========================================

export const PageSkeleton: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => (
  <div
    className={cn('space-y-6 p-6', className)}
    {...props}
  >
    {/* Header */}
    <div className="space-y-2">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    {/* Content */}
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  </div>
);
PageSkeleton.displayName = 'PageSkeleton';

// ===========================================
// LOADING ORB (Three.js placeholder)
// ===========================================

export interface LoadingOrbProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingOrb = React.forwardRef<HTMLDivElement, LoadingOrbProps>(
  ({ size = 'md', className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative flex items-center justify-center',
        size === 'sm' && 'h-16 w-16',
        size === 'md' && 'h-24 w-24',
        size === 'lg' && 'h-32 w-32',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 animate-spin rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-20 blur-xl" />
      <div className="relative h-1/2 w-1/2 rounded-full bg-gradient-to-br from-primary to-accent shadow-glow" />
    </div>
  )
);
LoadingOrb.displayName = 'LoadingOrb';

export {
  Spinner,
  Skeleton,
  PriceLoading,
  CardSkeleton,
  TableSkeleton,
  LoadingOrb,
};
