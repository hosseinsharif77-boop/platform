/**
 * Inventory Management Component
 * 
 * Component for managing product inventory.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Product, StockStatus } from '../types';

interface InventoryInfoProps {
  product: Product;
  onUpdateStock?: (data: {
    currentStock: number;
    minimumStock: number;
  }) => void;
  loading?: boolean;
}

export function InventoryInfo({ product, onUpdateStock, loading }: InventoryInfoProps) {
  const [currentStock, setCurrentStock] = React.useState(product.currentStock);
  const [minimumStock, setMinimumStock] = React.useState(product.minimumStock);

  const availableStock = product.currentStock - product.reservedStock;

  const getStockStatusColor = (status: StockStatus) => {
    switch (status) {
      case 'in_stock':
        return 'success';
      case 'low_stock':
        return 'warning';
      case 'out_of_stock':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const handleUpdate = () => {
    onUpdateStock?.({
      currentStock,
      minimumStock,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Inventory</CardTitle>
          <Badge variant={getStockStatusColor(product.stockStatus) as any}>
            {product.stockStatus.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stock Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{product.currentStock}</p>
            <p className="text-sm text-muted-foreground">Current Stock</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{product.reservedStock}</p>
            <p className="text-sm text-muted-foreground">Reserved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{availableStock}</p>
            <p className="text-sm text-muted-foreground">Available</p>
          </div>
        </div>

        {/* Stock Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Stock Level</span>
            <span>{availableStock} / {product.minimumStock + 100}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full transition-all',
                product.stockStatus === 'out_of_stock' && 'bg-destructive',
                product.stockStatus === 'low_stock' && 'bg-warning',
                product.stockStatus === 'in_stock' && 'bg-success'
              )}
              style={{
                width: `${Math.min(100, (availableStock / (product.minimumStock + 100)) * 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Low stock threshold: {product.minimumStock}
          </p>
        </div>

        {/* Update Stock */}
        {onUpdateStock && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">Update Stock</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentStock">Current Stock</Label>
                <Input
                  id="currentStock"
                  type="number"
                  value={currentStock}
                  onChange={(e) => setCurrentStock(parseInt(e.target.value) || 0)}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimumStock">Minimum Stock</Label>
                <Input
                  id="minimumStock"
                  type="number"
                  value={minimumStock}
                  onChange={(e) => setMinimumStock(parseInt(e.target.value) || 0)}
                  min={0}
                />
              </div>
            </div>
            <Button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Updating...' : 'Update Inventory'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default InventoryInfo;
