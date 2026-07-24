/**
 * StoreCard Component
 * 
 * Premium store card for marketplace vendor display.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { HoverLift } from '@/components/motion';

export interface StoreCardProps extends React.HTMLAttributes<HTMLDivElement> {
  store: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    banner?: string;
    description?: string;
    productCount?: number;
    rating?: number;
    reviewCount?: number;
    isVerified?: boolean;
    isFeatured?: boolean;
    joinedAt?: string;
  };
  onFollow?: (storeId: string) => void;
  onVisit?: (storeId: string) => void;
}

const StoreCard = React.forwardRef<HTMLDivElement, StoreCardProps>(
  ({ store, onFollow, onVisit, className, ...props }, ref) => {
    return (
      <HoverLift className={cn('group', className)}>
        <Card
          ref={ref}
          className="overflow-hidden transition-all duration-300 hover:shadow-lg"
          {...props}
        >
          {/* Banner */}
          <div className="relative h-32 bg-gradient-to-r from-primary/20 to-accent/20">
            {store.banner && (
              <img
                src={store.banner}
                alt={store.name}
                className="h-full w-full object-cover"
              />
            )}
            
            {/* Badges */}
            <div className="absolute right-3 top-3 flex gap-2">
              {store.isVerified && (
                <Badge variant="secondary" className="bg-info text-white">
                  <svg
                    className="mr-1 h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified
                </Badge>
              )}
              {store.isFeatured && (
                <Badge variant="secondary" className="bg-primary text-white">
                  Featured
                </Badge>
              )}
            </div>
          </div>

          <CardHeader className="relative pb-2">
            {/* Logo */}
            <div className="absolute -top-10 left-4">
              <Avatar className="h-20 w-20 border-4 border-background">
                <AvatarImage src={store.logo} alt={store.name} />
                <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                  {store.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </CardHeader>

          <CardContent className="pt-12">
            {/* Store Name */}
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
              {store.name}
            </h3>

            {/* Description */}
            {store.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {store.description}
              </p>
            )}

            {/* Stats */}
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              {store.productCount !== undefined && (
                <span>{store.productCount} products</span>
              )}
              {store.rating !== undefined && (
                <span className="flex items-center gap-1">
                  <svg
                    className="h-4 w-4 fill-warning text-warning"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {store.rating}
                  {store.reviewCount !== undefined && (
                    <span>({store.reviewCount})</span>
                  )}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onVisit?.(store.id)}
              >
                Visit Store
              </Button>
              {onFollow && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onFollow?.(store.id)}
                >
                  Follow
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </HoverLift>
    );
  }
);
StoreCard.displayName = 'StoreCard';

export { StoreCard };
