/**
 * Product List Page
 * 
 * Main product management page for sellers.
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProducts, useProductMutations, useProductStats } from '../hooks';
import { ProductCard } from './ProductCard';
import { ProductTable } from './ProductTable';
import { ProductFilters, ProductStatus } from '../types';

type ViewMode = 'grid' | 'table';

export function ProductListPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const {
    products,
    pagination,
    loading,
    filters,
    updateFilters,
    refetch,
  } = useProducts({
    page: 1,
    limit: 10,
  });

  const {
    statusCounts,
    stockSummary,
  } = useProductStats();

  const {
    loading: mutationLoading,
    deleteProduct,
    publishProduct,
    bulkDelete,
    bulkPublish,
  } = useProductMutations();

  // ===========================================
  // HANDLERS
  // ===========================================

  const handleViewProduct = (product: any) => {
    router.push(`/dashboard/products/${product._id}`);
  };

  const handleEditProduct = (product: any) => {
    router.push(`/dashboard/products/${product._id}/edit`);
  };

  const handleDeleteProduct = (product: any) => {
    setProductToDelete(product._id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      refetch();
    }
  };

  const handlePublishProduct = async (product: any) => {
    await publishProduct(product._id);
    refetch();
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length > 0) {
      await bulkDelete(selectedIds);
      setSelectedIds([]);
      refetch();
    }
  };

  const handleBulkPublish = async () => {
    if (selectedIds.length > 0) {
      await bulkPublish(selectedIds);
      setSelectedIds([]);
      refetch();
    }
  };

  // ===========================================
  // RENDER
  // ===========================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/products/new')}>
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{stockSummary?.totalProducts || 0}</p>
            <p className="text-sm text-muted-foreground">Total Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-success">{stockSummary?.inStock || 0}</p>
            <p className="text-sm text-muted-foreground">In Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-warning">{stockSummary?.lowStock || 0}</p>
            <p className="text-sm text-muted-foreground">Low Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-destructive">{stockSummary?.outOfStock || 0}</p>
            <p className="text-sm text-muted-foreground">Out of Stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search products..."
            value={filters.search || ''}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>
        
        <Select
          value={filters.status || 'all'}
          onValueChange={(value) => updateFilters({ status: value === 'all' ? undefined : value as ProductStatus })}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Table
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 rounded-lg bg-muted p-4">
          <span className="text-sm">
            {selectedIds.length} product(s) selected
          </span>
          <Button size="sm" onClick={handleBulkPublish}>
            Publish
          </Button>
          <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
            Delete
          </Button>
          <Button size="sm" variant="outline" onClick={() => setSelectedIds([])}>
            Clear Selection
          </Button>
        </div>
      )}

      {/* Products */}
      {viewMode === 'table' ? (
        <ProductTable
          products={products}
          selectedIds={selectedIds}
          onSelect={setSelectedIds}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onView={handleViewProduct}
          loading={loading}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[400px] animate-pulse rounded-lg bg-muted" />
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No products found
            </div>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onPublish={handlePublishProduct}
                onView={handleViewProduct}
              />
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} products
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrev}
              onClick={() => updateFilters({ page: pagination.page - 1 })}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNext}
              onClick={() => updateFilters({ page: pagination.page + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={mutationLoading}
            >
              {mutationLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper Card component for stats
function Card({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('rounded-lg border bg-card p-4', className)} {...props}>
      {children}
    </div>
  );
}

export default ProductListPage;
