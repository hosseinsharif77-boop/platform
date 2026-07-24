'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/dashboard/cards/StatsCard';
import { useDashboardStats } from '@/features/dashboard/hooks';

export default function DashboardHomePage() {
  const { stats, loading } = useDashboardStats();

  const formatCurrency = (amount: number) => new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">داشبورد فروشنده</h1>
        <p className="text-muted-foreground">خوش آمدید! وضعیت فروشگاه شما در زیر آمده است.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="فروش امروز" value={loading ? '...' : formatCurrency(stats?.todaySales || 0)} change={stats?.salesChange} changeLabel="نسبت به دیروز"
          icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatsCard title="سفارشات امروز" value={loading ? '...' : stats?.todayOrders || 0} change={stats?.ordersChange} changeLabel="نسبت به دیروز"
          icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
        />
        <StatsCard title="درآمد" value={loading ? '...' : formatCurrency(stats?.todayRevenue || 0)} change={stats?.revenueChange} changeLabel="نسبت به دیروز"
          icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        />
        <StatsCard title="محصولات" value={loading ? '...' : stats?.totalProducts || 0}
          icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>سفارشات اخیر</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link href="/dashboard/orders">مشاهده همه</Link></Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div>
                      <p className="font-medium">سفارش #{1000 + i}</p>
                      <p className="text-sm text-muted-foreground">نام مشتری</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{formatCurrency(999000 * i)}</p>
                    <Badge variant={i % 2 === 0 ? 'success' : 'secondary'}>
                      {i % 2 === 0 ? 'تکمیل شده' : 'در انتظار'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>دسترسی سریع</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/dashboard/products/new">
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                افزودن محصول جدید
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/orders">
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                مشاهده سفارشات
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/inventory">
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                مدیریت موجودی
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/analytics">
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                مشاهده آمار
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {stats && stats.lowStockProducts > 0 && (
        <Card className="border-warning">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <svg className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">هشدار موجودی کم</p>
                <p className="text-sm text-muted-foreground">{stats.lowStockProducts} محصول موجودی کمی دارند</p>
              </div>
            </div>
            <Button asChild variant="outline"><Link href="/dashboard/inventory">مدیریت موجودی</Link></Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
