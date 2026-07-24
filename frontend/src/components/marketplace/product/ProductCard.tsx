/**
 * Marketplace Product Card
 * 
 * Product card for marketplace display.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HoverScale } from '@/components/motion';
import { Product } from '../../features/marketplace/types';

interface MarketplaceProductCardProps {
  product: Product;
  className?: string;
}

export function MarketplaceProductCard({ product, className }: MarketplaceProductCardProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <HoverScale>
      <Link href={`/marketplace/products/${product._id}`}>
        <Card className={cn('group overflow-hidden transition-shadow hover:shadow-lg', className)}>
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            {product.mainImage?.url ? (
              <img
                src={product.mainImage.url}
                alt={product.mainImage.alt || product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}

            {/* Price Type Badge */}
            {product.priceType === 'dynamic' && (
              <div className="absolute left-2 top-2">
                <Badge variant="info" className="bg-info/10 text-info">
                  <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-info" />
                  Live
                </Badge>
              </div>
            )}

            {/* Stock Status */}
            {!product.inStock && (
              <div className="absolute right-2 top-2">
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            )}

            {product.inStock && product.lowStock && (
              <div className="absolute right-2 top-2">
                <Badge variant="warning">Low Stock</Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Store Name */}
            <p className="mb-1 text-xs text-muted-foreground">
              {product.storeName || 'Unknown Store'}
            </p>

            {/* Product Name */}
            <h3 className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">
              {product.name}
            </h3>

            {/* Rating */}
            {product.stats.averageRating > 0 && (
              <div className="mt-2 flex items-center gap-1">
                <div className="flex text-warning">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={cn(
                        'h-3 w-3',
                        i < Math.floor(product.stats.averageRating) ? 'fill-current' : 'fill-muted'
                      )}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.stats.reviewCount})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-lg font-bold text-foreground">
                {formatPrice(product.livePrice, product.currency)}
              </span>
              
              {product.compareAtPrice && product.compareAtPrice > product.livePrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice, product.currency)}
                </span>
              )}
            </div>

            {/* Last Updated */}
            {product.lastPriceUpdate && (
              <p className="mt-1 text-xs text-muted-foreground">
                Updated {getTimeAgo(product.lastPriceUpdate)}
              </p>
            )}
          </div>
        </Card>
      </Link>
    </HoverScale>
  );
}

export default MarketplaceProductCard;
