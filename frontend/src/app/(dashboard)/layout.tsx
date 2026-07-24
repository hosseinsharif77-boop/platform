/**
 * Dashboard Layout
 * 
 * Layout for seller dashboard pages.
 */

import { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';

export const metadata: Metadata = {
  title: {
    default: 'داشبورد فروشنده',
    template: '%s | داشبورد فروشنده',
  },
  description: 'مدیریت فروشگاه، محصولات و سفارشات شما',
};

interface DashboardRootLayoutProps {
  children: React.ReactNode;
}

export default function DashboardRootLayout({ children }: DashboardRootLayoutProps) {
  return (
    <DashboardLayout>{children}</DashboardLayout>
  );
}
