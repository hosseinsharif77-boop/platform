'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSystemHealth } from '@/features/admin/hooks';

export default function MonitoringPage() {
  const { health, loading } = useSystemHealth();

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days} روز ${hours} ساعت ${minutes} دقیقه`;
  };

  const formatBytes = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} مگابایت`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">مانیتورینگ سیستم</h1>
        <p className="text-muted-foreground">سلامت و وضعیت پلتفرم</p>
      </div>

      <Card className={cn('border-2', health?.status === 'healthy' && 'border-success', health?.status === 'degraded' && 'border-warning', health?.status === 'down' && 'border-destructive')}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn('h-4 w-4 rounded-full', health?.status === 'healthy' && 'bg-success', health?.status === 'degraded' && 'bg-warning', health?.status === 'down' && 'bg-destructive')} />
              <div>
                <p className="text-lg font-semibold">وضعیت سیستم: {health?.status === 'healthy' ? 'سالم' : health?.status === 'degraded' ? 'تضعیف شده' : health?.status === 'down' ? 'غیرفعال' : 'در حال بارگذاری...'}</p>
                <p className="text-sm text-muted-foreground">آپتایم: {health?.uptime ? formatUptime(health.uptime) : '...'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>
              MongoDB
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">وضعیت</span>
              <Badge variant={health?.services.mongodb === 'up' ? 'success' : 'destructive'}>
                {health?.services.mongodb === 'up' ? 'متصل' : 'قطع شده'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2M5 12a2 2 0 00-2 2v2a2 2 0 002 2h14a2 2 0 002-2v-2a2 2 0 00-2-2" /></svg>
              Redis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">وضعیت</span>
              <Badge variant={health?.services.redis === 'up' ? 'success' : 'destructive'}>
                {health?.services.redis === 'up' ? 'متصل' : 'قطع شده'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              صف پردازش (BullMQ)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">وضعیت</span>
              <Badge variant={health?.services.queue === 'up' ? 'success' : 'destructive'}>
                {health?.services.queue === 'up' ? 'سالم' : 'غیرفعال'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>استفاده از حافظه</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>حافظه استفاده شده</span>
                  <span>{health?.memory ? formatBytes(health.memory.heapUsed) : '...'}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: health?.memory ? `${(health.memory.heapUsed / health.memory.heapTotal) * 100}%` : '0%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>کل حافظه</span>
                  <span>{health?.memory ? formatBytes(health.memory.heapTotal) : '...'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>استفاده از پردازنده</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>کاربر</span>
                  <span>{health?.cpu ? `${(health.cpu.user / 1000000).toFixed(2)} ثانیه` : '...'}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>سیستم</span>
                  <span>{health?.cpu ? `${(health.cpu.system / 1000000).toFixed(2)} ثانیه` : '...'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
