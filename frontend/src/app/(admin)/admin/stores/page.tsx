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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAdminStores } from '@/features/admin/hooks';
import { adminStoresApi } from '@/features/admin/services';
import { StoreStatus } from '@/features/admin/types';

export default function StoresPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [actionDialog, setActionDialog] = useState<{ type: string; storeId: string } | null>(null);

  const { stores, total, loading, refetch } = useAdminStores({ status: status === 'all' ? undefined : status, search, page });

  const handleAction = async (action: string, storeId: string) => {
    try {
      switch (action) {
        case 'approve': await adminStoresApi.approveStore(storeId); break;
        case 'reject': await adminStoresApi.rejectStore(storeId); break;
        case 'suspend': await adminStoresApi.suspendStore(storeId); break;
        case 'delete': await adminStoresApi.deleteStore(storeId); break;
      }
      setActionDialog(null);
      refetch();
    } catch (err) { console.error('Action failed:', err); }
  };

  const getStatusBadge = (status: StoreStatus) => {
    switch (status) {
      case 'active': return <Badge variant="success">فعال</Badge>;
      case 'pending': return <Badge variant="warning">در انتظار</Badge>;
      case 'suspended': return <Badge variant="destructive">معلق</Badge>;
      case 'rejected': return <Badge variant="destructive">رد شده</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">فروشگاه‌ها</h1>
        <p className="text-muted-foreground">مدیریت فروشگاه‌های بازارچه</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">۲۳۴</p><p className="text-sm text-muted-foreground">کل فروشگاه‌ها</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-warning">۵</p><p className="text-sm text-muted-foreground">در انتظار</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-success">۲۲۰</p><p className="text-sm text-muted-foreground">فعال</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-destructive">۹</p><p className="text-sm text-muted-foreground">معلق</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <Input placeholder="جستجوی فروشگاه‌ها..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="وضعیت" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="pending">در انتظار</SelectItem>
                <SelectItem value="active">فعال</SelectItem>
                <SelectItem value="suspended">معلق</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>همه فروشگاه‌ها ({total})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>فروشگاه</TableHead>
                <TableHead>مالک</TableHead>
                <TableHead>محصولات</TableHead>
                <TableHead>سفارشات</TableHead>
                <TableHead>درآمد</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead className="text-left">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="h-24 text-center">در حال بارگذاری...</TableCell></TableRow>
              ) : stores.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="h-24 text-center">فروشگاهی یافت نشد</TableCell></TableRow>
              ) : (
                stores.map((store) => (
                  <TableRow key={store._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{store.name}</p>
                        <p className="text-xs text-muted-foreground">{store.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{store.ownerName}</p>
                        <p className="text-xs text-muted-foreground">{store.ownerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>{store.productCount}</TableCell>
                    <TableCell>{store.orderCount}</TableCell>
                    <TableCell>{formatCurrency(store.revenue)}</TableCell>
                    <TableCell>{getStatusBadge(store.status)}</TableCell>
                    <TableCell className="text-left">
                      <div className="flex gap-2">
                        {store.status === 'pending' && (
                          <>
                            <Button size="sm" onClick={() => setActionDialog({ type: 'approve', storeId: store._id })}>تایید</Button>
                            <Button size="sm" variant="outline" onClick={() => setActionDialog({ type: 'reject', storeId: store._id })}>رد</Button>
                          </>
                        )}
                        {store.status === 'active' && (
                          <Button size="sm" variant="outline" onClick={() => setActionDialog({ type: 'suspend', storeId: store._id })}>تعلیق</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {total > 20 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">نمایش {((page - 1) * 20) + 1} تا {Math.min(page * 20, total)} از {total}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>قبلی</Button>
                <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page * 20 >= total}>بعدی</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog?.type === 'approve' ? 'تایید فروشگاه' : actionDialog?.type === 'reject' ? 'رد فروشگاه' : actionDialog?.type === 'suspend' ? 'تعلیق فروشگاه' : 'حذف فروشگاه'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog?.type === 'approve' ? 'فروشگاه قادر به فروش محصولات در پلتفرم خواهد بود.' : actionDialog?.type === 'reject' ? 'فروشگاه قادر به فروش محصولات نخواهد بود.' : actionDialog?.type === 'suspend' ? 'فروشگاه به صورت موقت معلق خواهد شد.' : 'این عملیات غیرقابل بازگشت است. فروشگاه به صورت دائمی حذف خواهد شد.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>انصراف</Button>
            <Button variant={actionDialog?.type === 'delete' || actionDialog?.type === 'reject' ? 'destructive' : 'default'} onClick={() => actionDialog && handleAction(actionDialog.type, actionDialog.storeId)}>تایید</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
