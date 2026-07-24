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
import { useAdminUsers } from '@/features/admin/hooks';
import { adminUsersApi } from '@/features/admin/services';
import { UserRole, UserStatus } from '@/features/admin/types';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [actionDialog, setActionDialog] = useState<{ type: string; userId: string } | null>(null);

  const { users, total, loading, refetch } = useAdminUsers({
    role: role === 'all' ? undefined : role,
    status: status === 'all' ? undefined : status,
    search,
    page,
  });

  const handleAction = async (action: string, userId: string) => {
    try {
      switch (action) {
        case 'suspend': await adminUsersApi.updateUserStatus(userId, 'suspended'); break;
        case 'activate': await adminUsersApi.updateUserStatus(userId, 'active'); break;
        case 'delete': await adminUsersApi.deleteUser(userId); break;
      }
      setActionDialog(null);
      refetch();
    } catch (err) { console.error('Action failed:', err); }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return <Badge variant="destructive">مدیر ارشد</Badge>;
      case 'admin': return <Badge variant="warning">مدیر</Badge>;
      case 'vendor': return <Badge variant="info">فروشنده</Badge>;
      default: return <Badge variant="secondary">مشتری</Badge>;
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'active': return <Badge variant="success">فعال</Badge>;
      case 'suspended': return <Badge variant="warning">معلق</Badge>;
      case 'banned': return <Badge variant="destructive">مسدود</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">کاربران</h1>
          <p className="text-muted-foreground">مدیریت کاربران پلتفرم</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">۱,۲۳۴</p><p className="text-sm text-muted-foreground">کل کاربران</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">۴۵۶</p><p className="text-sm text-muted-foreground">فروشندگان</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">۷۶۸</p><p className="text-sm text-muted-foreground">مشتریان</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">۱۰</p><p className="text-sm text-muted-foreground">مدیران</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <Input placeholder="جستجوی کاربران..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-40"><SelectValue placeholder="نقش" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه نقش‌ها</SelectItem>
                <SelectItem value="customer">مشتریان</SelectItem>
                <SelectItem value="vendor">فروشندگان</SelectItem>
                <SelectItem value="admin">مدیران</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="وضعیت" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="active">فعال</SelectItem>
                <SelectItem value="suspended">معلق</SelectItem>
                <SelectItem value="banned">مسدود</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>همه کاربران ({total})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>کاربر</TableHead>
                <TableHead>نقش</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>تایید شده</TableHead>
                <TableHead>آخرین ورود</TableHead>
                <TableHead>تاریخ عضویت</TableHead>
                <TableHead className="text-left">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="h-24 text-center">در حال بارگذاری...</TableCell></TableRow>
              ) : users.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="h-24 text-center">کاربری یافت نشد</TableCell></TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-sm font-medium">{user.firstName[0]}{user.lastName[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      {user.isEmailVerified ? <Badge variant="success" className="text-xs">تایید شده</Badge> : <Badge variant="secondary" className="text-xs">تایید نشده</Badge>}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('fa-IR') : 'هرگز'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setActionDialog({ type: user.status === 'active' ? 'suspend' : 'activate', userId: user._id })}>
                          {user.status === 'active' ? 'تعلیق' : 'فعال‌سازی'}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setActionDialog({ type: 'delete', userId: user._id })}>
                          حذف
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {total > 20 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                نمایش {((page - 1) * 20) + 1} تا {Math.min(page * 20, total)} از {total}
              </p>
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
              {actionDialog?.type === 'delete' ? 'حذف کاربر' : actionDialog?.type === 'suspend' ? 'تعلیق کاربر' : 'فعال‌سازی کاربر'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog?.type === 'delete' ? 'این عملیات غیرقابل بازگشت است. کاربر به صورت دائمی حذف خواهد شد.' : actionDialog?.type === 'suspend' ? 'کاربر قادر به دسترسی به پلتفرم نخواهد بود.' : 'کاربر قادر به دسترسی مجدد به پلتفرم خواهد بود.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>انصراف</Button>
            <Button variant={actionDialog?.type === 'delete' ? 'destructive' : 'default'} onClick={() => actionDialog && handleAction(actionDialog.type, actionDialog.userId)}>تایید</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
