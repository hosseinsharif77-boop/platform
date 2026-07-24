/**
 * Search Filters Component
 * 
 * Filters for product search results.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchFilters as SearchFiltersType } from '../../features/marketplace/types';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFilterChange: (filters: Partial<SearchFiltersType>) => void;
  categories?: any[];
  brands?: any[];
  stores?: any[];
  className?: string;
}

export function SearchFilters({
  filters,
  onFilterChange,
  categories = [],
  brands = [],
  stores = [],
  className,
}: SearchFiltersProps) {
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'updated', label: 'Recently Updated' },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Sort */}
      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select
          value={filters.sortBy || 'relevance'}
          onValueChange={(value) => onFilterChange({ sortBy: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label>Price Range</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <Label>Category</Label>
          <div className="max-h-[200px] overflow-y-auto space-y-2">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center gap-2">
                <Checkbox
                  id={`category-${category._id}`}
                  checked={filters.category === category._id}
                  onCheckedChange={(checked) =>
                    onFilterChange({ category: checked ? category._id : undefined })
                  }
                />
                <label
                  htmlFor={`category-${category._id}`}
                  className="text-sm cursor-pointer"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div className="space-y-2">
          <Label>Brand</Label>
          <div className="max-h-[200px] overflow-y-auto space-y-2">
            {brands.map((brand) => (
              <div key={brand._id} className="flex items-center gap-2">
                <Checkbox
                  id={`brand-${brand._id}`}
                  checked={filters.brand === brand._id}
                  onCheckedChange={(checked) =>
                    onFilterChange({ brand: checked ? brand._id : undefined })
                  }
                />
                <label
                  htmlFor={`brand-${brand._id}`}
                  className="text-sm cursor-pointer"
                >
                  {brand.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      <div className="space-y-2">
        <Label>Availability</Label>
        <div className="flex items-center gap-2">
          <Checkbox
            id="in-stock"
            checked={filters.inStock === true}
            onCheckedChange={(checked) =>
              onFilterChange({ inStock: checked ? true : undefined })
            }
          />
          <label htmlFor="in-stock" className="text-sm cursor-pointer">
            In Stock Only
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() =>
          onFilterChange({
            category: undefined,
            brand: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            inStock: undefined,
            sortBy: 'relevance',
          })
        }
      >
        Clear All Filters
      </Button>
    </div>
  );
}

export default SearchFilters;
