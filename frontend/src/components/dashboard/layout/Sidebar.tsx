'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  isOpen: boolean;
  isMobileOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    label: 'نمای کلی',
    items: [
      { name: 'داشبورد', href: '/dashboard', icon: 'home' },
    ],
  },
  {
    label: 'مدیریت',
    items: [
      { name: 'محصولات', href: '/dashboard/products', icon: 'package' },
      { name: 'سفارشات', href: '/dashboard/orders', icon: 'shopping-bag' },
      { name: 'موجودی', href: '/dashboard/inventory', icon: 'warehouse' },
      { name: 'قیمت‌گذاری', href: '/dashboard/pricing', icon: 'tag' },
    ],
  },
  {
    label: 'تحلیل‌ها',
    items: [
      { name: 'آمار و ارقام', href: '/dashboard/analytics', icon: 'bar-chart' },
      { name: 'اعلان‌ها', href: '/dashboard/notifications', icon: 'bell' },
    ],
  },
  {
    label: 'تنظیمات',
    items: [
      { name: 'تنظیمات فروشگاه', href: '/dashboard/settings/store', icon: 'store' },
      { name: 'پروفایل', href: '/dashboard/settings/profile', icon: 'user' },
    ],
  },
];

const iconMap: Record<string, React.ReactNode> = {
  home: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  package: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  'shopping-bag': <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  warehouse: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  tag: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
  'bar-chart': <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  bell: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  store: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  user: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
};

export function Sidebar({ isOpen, isMobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-64 flex-col border-l bg-background transition-transform duration-200',
          'lg:relative lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : 'translate-x-full',
          !isOpen && 'lg:w-16'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <span className="text-sm font-bold">LP</span>
            </div>
            {isOpen && <span className="text-lg font-bold">پنل فروشنده</span>}
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-6 px-3">
            {navigation.map((section) => (
              <div key={section.label}>
                {isOpen && (
                  <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                    {section.label}
                  </h3>
                )}
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                            !isOpen && 'justify-center px-2'
                          )}
                          title={!isOpen ? item.name : undefined}
                        >
                          {iconMap[item.icon]}
                          {isOpen && <span>{item.name}</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {isOpen && (
          <div className="border-t p-4">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">نیاز به کمک دارید؟ مستندات ما را بررسی کنید.</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
