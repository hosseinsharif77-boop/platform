/**
 * Admin Layout
 * 
 * Layout for admin panel pages.
 */

import { Metadata } from 'next';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';

export const metadata: Metadata = {
  title: {
    default: 'پنل مدیریت',
    template: '%s | پنل مدیریت',
  },
  description: 'مدیریت پلتفرم قیمت زنده',
};

interface AdminRootLayoutProps {
  children: React.ReactNode;
}

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
  return (
    <AdminLayout>{children}</AdminLayout>
  );
}
