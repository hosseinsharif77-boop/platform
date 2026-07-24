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
import { useOrders } from '@/features/dashboard/hooks';
import { OrderStatus } from '@/features/dashboard/types';

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  const { orders, total, loading } = useOrders({ page, limit: 10, status: status === 'all' ? undefined : status, search });

  const formatPrice = (price: number) => new Intl.NumberFormat('fa-IR').format(price) + ' تومان';

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'delivered': return 'تحویل شده';
      case 'shipped': return 'ارسال شده';
      case 'processing': return 'در حال پردازش';
      case 'pending': return 'در انتظار';
      case 'cancelled': return 'لغو شده';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">سفارشات</h1>
        <p className="text-muted-foreground">مدیریت سفارشات مشتریان</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">۱۲</p><p className="text-sm text-muted-foreground">در انتظار</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">۸</p><p className="text-sm text-muted-foreground">در حال پردازش</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">۲۴</p><p className="text-sm text-muted-foreground">ارسال شده</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">۱۵۶</p><p className="text-sm text-muted-foreground">تحویل شده</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <Input placeholder="جستجوی سفارشات..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="وضعیت" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="pending">در انتظار</SelectItem>
                <SelectItem value="processing">در حال پردازش</SelectItem>
                <SelectItem value="shipped">ارسال شده</SelectItem>
                <SelectItem value="delivered">تحویل شده</SelectItem>
                <SelectItem value="cancelled">لغو شده</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>همه سفارشات ({total})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>سفارش</TableHead>
                <TableHead>مشتری</TableHead>
                <TableHead>اقلام</TableHead>
                <TableHead>مجموع</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>تاریخ</TableHead>
                <TableHead className="text-left">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="h-24 text-center">در حال بارگذاری...</TableCell></TableRow>
              ) : orders.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="h-24 text-center">سفارشی یافت نشد</TableCell></TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell><p className="font-medium">#{order.orderNumber}</p></TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>{order.items.length} قلم</TableCell>
                    <TableCell className="font-medium">{formatPrice(order.total)}</TableCell>
                    <TableCell><Badge variant={getStatusColor(order.status) as any}>{getStatusLabel(order.status)}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('fa-IR')}</TableCell>
                    <TableCell className="text-left">
                      <Button variant="ghost" size="sm" asChild><Link href={`/dashboard/orders/${order._id}`}>مشاهده</Link></Button>
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
