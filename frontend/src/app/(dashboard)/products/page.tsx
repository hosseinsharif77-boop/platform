'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProducts } from '@/features/dashboard/hooks';
import { DashboardProduct } from '@/features/dashboard/types';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  const { products, total, loading } = useProducts({ page, limit: 10, status: status === 'all' ? undefined : status, search });

  const formatPrice = (price: number) => new Intl.NumberFormat('fa-IR').format(price) + ' تومان';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">محصولات</h1>
          <p className="text-muted-foreground">مدیریت موجودی محصولات</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            افزودن محصول
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <Input placeholder="جستجوی محصولات..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="وضعیت" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="draft">پیش‌نویس</SelectItem>
                <SelectItem value="published">منتشر شده</SelectItem>
                <SelectItem value="archived">بایگانی شده</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>همه محصولات ({total})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>محصول</TableHead>
                <TableHead>کد</TableHead>
                <TableHead>قیمت</TableHead>
                <TableHead>موجودی</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead className="text-left">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="h-24 text-center">در حال بارگذاری...</TableCell></TableRow>
              ) : products.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="h-24 text-center">محصولی یافت نشد</TableCell></TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded bg-muted">
                          {product.image ? <img src={product.image} alt={product.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-xs text-muted-foreground">بدون تصویر</div>}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.categoryName || 'بدون دسته‌بندی'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><code className="text-xs">{product.sku}</code></TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{formatPrice(product.price)}</p>
                        {product.livePrice && product.livePrice !== product.price && <p className="text-xs text-success">لحظه‌ای: {formatPrice(product.livePrice)}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'destructive'}>
                        {product.stock} عدد
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.status === 'published' ? 'success' : 'secondary'}>
                        {product.status === 'published' ? 'منتشر شده' : product.status === 'draft' ? 'پیش‌نویس' : 'بایگانی'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-left">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/products/${product._id}/edit`}>ویرایش</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {total > 10 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">نمایش {((page - 1) * 10) + 1} تا {Math.min(page * 10, total)} از {total}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>قبلی</Button>
                <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page * 10 >= total}>بعدی</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
