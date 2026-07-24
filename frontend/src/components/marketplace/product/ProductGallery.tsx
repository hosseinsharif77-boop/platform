/**
 * Product Gallery Component
 * 
 * Image gallery for product details.
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ProductImage } from '../../features/marketplace/types';

interface ProductGalleryProps {
  images: ProductImage[];
  mainImage?: ProductImage;
  className?: string;
}

export function ProductGallery({ images, mainImage, className }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(
    mainImage || images[0] || null
  );

  const allImages = mainImage
    ? [mainImage, ...images.filter((img) => img._id !== mainImage._id)]
    : images;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        {selectedImage?.url ? (
          <img
            src={selectedImage.url}
            alt={selectedImage.alt || 'Product image'}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No Image Available
          </div>
        )}

        {/* Zoom Button */}
        {selectedImage?.url && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-4 right-4"
            onClick={() => {
              // TODO: Implement image zoom modal
            }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </Button>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={image._id || index}
              onClick={() => setSelectedImage(image)}
              className={cn(
                'flex-shrink-0 overflow-hidden rounded-md border-2 transition-all',
                selectedImage?._id === image._id
                  ? 'border-primary'
                  : 'border-transparent hover:border-muted-foreground/50'
              )}
            >
              <img
                src={image.url}
                alt={image.alt || `Product image ${index + 1}`}
                className="h-16 w-16 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
