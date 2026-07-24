/**
 * Marketplace UI Components
 * 
 * Shared UI components for the marketplace.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// ===========================================
// BREADCRUMB
// ===========================================

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center gap-2 text-sm', className)}>
      <a href="/" className="text-muted-foreground hover:text-foreground">
        Home
      </a>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="text-muted-foreground">/</span>
          {item.href ? (
            <a href={item.href} className="text-muted-foreground hover:text-foreground">
              {item.label}
            </a>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// ===========================================
// SKELETON LOADER
// ===========================================

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-md bg-muted', className)} />
  );
}

// ===========================================
// PRODUCT CARD SKELETON
// ===========================================

export function ProductCardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('overflow-hidden rounded-lg border', className)}>
      <Skeleton className="aspect-square" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-6 w-1/4" />
      </div>
    </div>
  );
}

// ===========================================
// PRODUCT GRID SKELETON
// ===========================================

export function ProductGridSkeleton({ count = 8, className }: SkeletonProps & { count?: number }) {
  return (
    <div className={cn('grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ===========================================
// EMPTY STATE
// ===========================================

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className="mb-4 rounded-full bg-muted p-4">
        <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
      {action && (
        <a
          href={action.href}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}

// ===========================================
// ERROR STATE
// ===========================================

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className="mb-4 rounded-full bg-destructive/10 p-4">
        <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
