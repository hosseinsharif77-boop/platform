/**
 * ProductCard Component
 * 
 * Premium product card with hover effects and price display.
 * Designed for marketplace interfaces.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PriceBadge } from '@/components/ui/price-badge';
import { LiveBadge } from '@/components/ui/live-badge';
import { Button } from '@/components/ui/button';
import { HoverLift } from '@/components/motion';

export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    currency?: string;
    images?: string[];
    store?: {
      name: string;
      slug: string;
    };
    rating?: number;
    reviewCount?: number;
    isLive?: boolean;
    isNew?: boolean;
    isFeatured?: boolean;
  };
  onAddToCart?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, onAddToCart, onQuickView, className, ...props }, ref) => {
    return (
      <HoverLift className={cn('group', className)}>
        <Card
          ref={ref}
          className="overflow-hidden transition-all duration-300 hover:shadow-lg"
          {...props}
        >
          <CardHeader className="p-0">
            <div className="relative aspect-square overflow-hidden bg-muted">
              {/* Product Image */}
              {product.images && product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}

              {/* Badges */}
              <div className="absolute left-3 top-3 flex flex-col gap-2">
                {product.isNew && (
                  <Badge variant="secondary" className="bg-accent text-white">
                    New
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge variant="secondary" className="bg-primary text-white">
                    Featured
                  </Badge>
                )}
              </div>

              {/* Live Badge */}
              {product.isLive && (
                <div className="absolute right-3 top-3">
                  <LiveBadge label="Live" variant="success" />
                </div>
              )}

              {/* Quick View Button */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onQuickView?.(product.id)}
                  className="translate-y-4 transition-transform duration-300 group-hover:translate-y-0"
                >
                  Quick View
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            {/* Store Name */}
            {product.store && (
              <p className="mb-1 text-xs text-muted-foreground">
                {product.store.name}
              </p>
            )}

            {/* Product Name */}
            <h3 className="line-clamp-2 font-medium text-foreground transition-colors group-hover:text-primary">
              {product.name}
            </h3>

            {/* Rating */}
            {product.rating !== undefined && (
              <div className="mt-2 flex items-center gap-1">
                <div className="flex text-warning">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={cn(
                        'h-3 w-3',
                        i < Math.floor(product.rating!) ? 'fill-current' : 'fill-muted'
                      )}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount})
                </span>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <div className="flex w-full items-center justify-between">
              <PriceBadge
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                currency={product.currency}
                size="lg"
                animate
              />
              
              {onAddToCart && (
                <Button
                  size="sm"
                  onClick={() => onAddToCart(product.id)}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Add to Cart
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </HoverLift>
    );
  }
);
ProductCard.displayName = 'ProductCard';

export { ProductCard };
