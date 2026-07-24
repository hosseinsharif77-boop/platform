/**
 * Product Card Component
 * 
 * Displays a product in card format.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PriceBadge } from '@/components/ui/price-badge';
import { LiveBadge } from '@/components/ui/live-badge';
import { Product, ProductStatus, PriceType } from '../types';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onPublish?: (product: Product) => void;
  onView?: (product: Product) => void;
  className?: string;
}

export function ProductCard({
  product,
  onEdit,
  onDelete,
  onPublish,
  onView,
  className,
}: ProductCardProps) {
  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.PUBLISHED:
        return 'success';
      case ProductStatus.DRAFT:
        return 'secondary';
      case ProductStatus.PENDING_REVIEW:
        return 'warning';
      case ProductStatus.HIDDEN:
        return 'muted';
      case ProductStatus.ARCHIVED:
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStockStatus = () => {
    if (!product.trackInventory) return null;
    
    if (product.stockStatus === 'out_of_stock') {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (product.stockStatus === 'low_stock') {
      return <Badge variant="warning">Low Stock</Badge>;
    }
    return null;
  };

  return (
    <Card className={cn('group overflow-hidden', className)}>
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.mainImage?.url ? (
          <img
            src={product.mainImage.url}
            alt={product.mainImage.alt || product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute left-2 top-2">
          <Badge variant={getStatusColor(product.status) as any}>
            {product.status.replace('_', ' ')}
          </Badge>
        </div>

        {/* Price Type Badge */}
        <div className="absolute right-2 top-2">
          {product.priceType === PriceType.DYNAMIC && (
            <LiveBadge label="Dynamic" variant="info" />
          )}
        </div>

        {/* Stock Status */}
        <div className="absolute bottom-2 right-2">
          {getStockStatus()}
        </div>
      </div>

      <CardContent className="p-4">
        {/* Category & Brand */}
        <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
          {product.categoryName && <span>{product.categoryName}</span>}
          {product.brandName && (
            <>
              <span>•</span>
              <span>{product.brandName}</span>
            </>
          )}
        </div>

        {/* Product Name */}
        <h3 className="line-clamp-2 font-medium text-foreground group-hover:text-primary">
          {product.name}
        </h3>

        {/* SKU */}
        <p className="mt-1 text-xs text-muted-foreground">
          SKU: {product.sku}
        </p>

        {/* Description */}
        {product.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {product.shortDescription}
          </p>
        )}

        {/* Stats */}
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {product.stats.viewCount}
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {product.stats.orderCount}
          </span>
          {product.stats.averageRating > 0 && (
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3 fill-warning text-warning" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {product.stats.averageRating.toFixed(1)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center justify-between">
          {/* Price */}
          <PriceBadge
            price={product.livePrice || product.basePrice}
            currency={product.currency}
            size="lg"
          />

          {/* Actions */}
          <div className="flex gap-2">
            {product.status === ProductStatus.DRAFT && onPublish && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPublish(product)}
              >
                Publish
              </Button>
            )}
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(product)}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
