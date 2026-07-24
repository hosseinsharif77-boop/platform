/**
 * Category Card Component
 * 
 * Card for displaying category information.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { HoverScale } from '@/components/motion';
import { Category } from '../../features/marketplace/types';

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <HoverScale>
      <Link href={`/marketplace/categories/${category.slug}`}>
        <div
          className={cn(
            'group relative overflow-hidden rounded-lg border bg-card p-6 transition-shadow hover:shadow-lg',
            className
          )}
        >
          {/* Image */}
          {category.image ? (
            <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="mb-4 flex aspect-square items-center justify-center rounded-lg bg-primary/10">
              {category.icon ? (
                <span className="text-4xl">{category.icon}</span>
              ) : (
                <svg className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              )}
            </div>
          )}

          {/* Content */}
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
            {category.name}
          </h3>
          
          {category.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {category.description}
            </p>
          )}

          {/* Product Count */}
          <p className="mt-3 text-sm text-muted-foreground">
            {category.productCount} products
          </p>

          {/* Arrow */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
            <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </HoverScale>
  );
}

export default CategoryCard;
