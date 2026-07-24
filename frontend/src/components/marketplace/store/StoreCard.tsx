/**
 * Store Card Component
 * 
 * Card for displaying store information.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HoverLift } from '@/components/motion';
import { Store } from '../../features/marketplace/types';

interface StoreCardProps {
  store: Store;
  className?: string;
}

export function StoreCard({ store, className }: StoreCardProps) {
  return (
    <HoverLift>
      <Link href={`/marketplace/stores/${store.slug}`}>
        <Card className={cn('overflow-hidden transition-shadow hover:shadow-lg', className)}>
          {/* Banner */}
          <div className="relative h-32 bg-gradient-to-r from-primary/20 to-accent/20">
            {store.banner && (
              <img
                src={store.banner}
                alt={store.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <CardContent className="relative p-4">
            {/* Logo */}
            <div className="absolute -top-10 left-4">
              <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-background bg-muted">
                {store.logo ? (
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xl font-bold text-primary">
                    {store.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Store Info */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
                {store.name}
              </h3>
              
              {store.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {store.description}
                </p>
              )}

              {/* Stats */}
              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <span>{store.stats.totalProducts} products</span>
                
                {store.stats.averageRating > 0 && (
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4 fill-warning text-warning" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {store.stats.averageRating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </HoverLift>
  );
}

export default StoreCard;
