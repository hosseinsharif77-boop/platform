/**
 * Product Table Component
 * 
 * Displays products in a table format with actions.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Product, ProductStatus } from '../types';

interface ProductTableProps {
  products: Product[];
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
  loading?: boolean;
}

export function ProductTable({
  products,
  selectedIds,
  onSelect,
  onEdit,
  onDelete,
  onView,
  loading,
}: ProductTableProps) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelect(products.map((p) => p._id));
    } else {
      onSelect([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelect([...selectedIds, id]);
    } else {
      onSelect(selectedIds.filter((i) => i !== id));
    }
  };

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

  const getStockBadge = (product: Product) => {
    if (!product.trackInventory) return null;

    if (product.stockStatus === 'out_of_stock') {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (product.stockStatus === 'low_stock') {
      return <Badge variant="warning">Low Stock</Badge>;
    }
    return <Badge variant="success">In Stock</Badge>;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === products.length && products.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No products found
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(product._id)}
                    onCheckedChange={(checked) => handleSelectOne(product._id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded bg-muted">
                      {product.mainImage?.url ? (
                        <img
                          src={product.mainImage.url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          No img
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.categoryName || 'No category'}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs">{product.sku}</code>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      ${product.livePrice || product.basePrice}
                    </p>
                    {product.priceType === 'dynamic' && (
                      <p className="text-xs text-muted-foreground">Dynamic</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    {getStockBadge(product)}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {product.currentStock} units
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(product.status) as any}>
                    {product.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(product)}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => onDelete(product)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default ProductTable;
