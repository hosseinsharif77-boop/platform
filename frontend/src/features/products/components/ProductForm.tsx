/**
 * Product Form Component
 * 
 * Form for creating and editing products.
 */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Product, CreateProductDTO, UpdateProductDTO, PriceType } from '../types';

// ===========================================
// VALIDATION SCHEMA
// ===========================================

const productSchema = z.object({
  name: z.string().min(3).max(200),
  shortDescription: z.string().max(500).optional(),
  fullDescription: z.string().max(10000).optional(),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  priceType: z.enum(['static', 'dynamic']),
  basePrice: z.number().min(0, 'Price must be positive'),
  currency: z.string().length(3).optional(),
  sku: z.string().min(1, 'SKU is required').max(50),
  barcode: z.string().max(100).optional(),
  currentStock: z.number().int().min(0).optional(),
  minimumStock: z.number().int().min(0).optional(),
  trackInventory: z.boolean().optional(),
  weight: z.number().min(0).optional(),
  weightUnit: z.enum(['kg', 'g', 'lb', 'oz']).optional(),
  dimensions: z.object({
    length: z.number().min(0).optional(),
    width: z.number().min(0).optional(),
    height: z.number().min(0).optional(),
    unit: z.enum(['cm', 'in', 'mm']).optional(),
  }).optional(),
  status: z.enum(['draft', 'pending_review', 'published', 'hidden', 'archived']).optional(),
  visibility: z.enum(['public', 'private', 'hidden']).optional(),
  seo: z.object({
    title: z.string().max(70).optional(),
    description: z.string().max(170).optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
  specifications: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

// ===========================================
// COMPONENT PROPS
// ===========================================

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductDTO | UpdateProductDTO) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

// ===========================================
// COMPONENT
// ===========================================

export function ProductForm({
  product,
  onSubmit,
  onCancel,
  loading,
  className,
}: ProductFormProps) {
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      shortDescription: product?.shortDescription || '',
      fullDescription: product?.fullDescription || '',
      categoryId: product?.categoryId || '',
      brandId: product?.brandId || '',
      tags: product?.tags || [],
      priceType: product?.priceType || PriceType.STATIC,
      basePrice: product?.basePrice || 0,
      currency: product?.currency || 'USD',
      sku: product?.sku || '',
      barcode: product?.barcode || '',
      currentStock: product?.currentStock || 0,
      minimumStock: product?.minimumStock || 0,
      trackInventory: product?.trackInventory ?? true,
      weight: product?.weight,
      weightUnit: product?.weightUnit || 'kg',
      dimensions: product?.dimensions || { unit: 'cm' },
      status: product?.status || 'draft',
      visibility: product?.visibility || 'public',
      seo: product?.seo || {},
      specifications: product?.specifications || [],
    },
  });

  const priceType = watch('priceType');

  const handleFormSubmit = async (data: ProductFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={cn('space-y-6', className)}>
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Enter the basic details for your product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea
              id="shortDescription"
              {...register('shortDescription')}
              placeholder="Brief description (max 500 characters)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullDescription">Full Description</Label>
            <Textarea
              id="fullDescription"
              {...register('fullDescription')}
              placeholder="Detailed product description"
              rows={6}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category *</Label>
              <Select
                value={watch('categoryId')}
                onValueChange={(value) => setValue('categoryId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {/* Categories will be loaded dynamically */}
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-destructive">{errors.categoryId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandId">Brand</Label>
              <Select
                value={watch('brandId')}
                onValueChange={(value) => setValue('brandId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {/* Brands will be loaded dynamically */}
                  <SelectItem value="brand1">Brand 1</SelectItem>
                  <SelectItem value="brand2">Brand 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
          <CardDescription>
            Set your product pricing strategy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="priceType">Price Type *</Label>
              <Select
                value={watch('priceType')}
                onValueChange={(value) => setValue('priceType', value as PriceType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="static">Static Price</SelectItem>
                  <SelectItem value="dynamic">Dynamic Price</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price *</Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                {...register('basePrice', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.basePrice && (
                <p className="text-sm text-destructive">{errors.basePrice.message}</p>
              )}
            </div>
          </div>

          {priceType === 'dynamic' && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                Dynamic pricing will be calculated by the Pricing Engine based on exchange rates and rules.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>
            Manage stock levels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Track Inventory</Label>
              <p className="text-sm text-muted-foreground">
                Enable inventory tracking for this product
              </p>
            </div>
            <Switch
              checked={watch('trackInventory')}
              onCheckedChange={(checked) => setValue('trackInventory', checked)}
            />
          </div>

          {watch('trackInventory') && (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="currentStock">Current Stock</Label>
                <Input
                  id="currentStock"
                  type="number"
                  {...register('currentStock', { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumStock">Minimum Stock</Label>
                <Input
                  id="minimumStock"
                  type="number"
                  {...register('minimumStock', { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  {...register('sku')}
                  placeholder="Enter SKU"
                />
                {errors.sku && (
                  <p className="text-sm text-destructive">{errors.sku.message}</p>
                )}
              </div>
            </div>
          )}

          {!watch('trackInventory') && (
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                {...register('sku')}
                placeholder="Enter SKU"
              />
              {errors.sku && (
                <p className="text-sm text-destructive">{errors.sku.message}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
          <CardDescription>
            Optimize for search engines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seo.title">SEO Title</Label>
            <Input
              id="seo.title"
              {...register('seo.title')}
              placeholder="SEO optimized title (max 70 characters)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo.description">SEO Description</Label>
            <Textarea
              id="seo.description"
              {...register('seo.description')}
              placeholder="SEO meta description (max 170 characters)"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;
