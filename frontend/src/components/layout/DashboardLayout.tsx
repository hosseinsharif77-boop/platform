/**
 * Dashboard Layout
 * 
 * Layout for seller and admin dashboards.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Navbar } from './Navbar';
import { Sidebar, SidebarItem } from './Sidebar';

export interface DashboardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  sidebarFooter?: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onSearch?: (query: string) => void;
  onLogout?: () => void;
}

const DashboardLayout = React.forwardRef<HTMLDivElement, DashboardLayoutProps>(
  (
    {
      children,
      sidebarItems,
      sidebarFooter,
      user,
      onSearch,
      onLogout,
      className,
      ...props
    },
    ref
  ) => {
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn('flex h-screen overflow-hidden', className)}
        {...props}
      >
        {/* Sidebar */}
        <Sidebar
          items={sidebarItems}
          footer={sidebarFooter}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Navbar */}
          <Navbar
            isAuthenticated={!!user}
            user={user}
            onSearch={onSearch}
            onLogout={onLogout}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    );
  }
);
DashboardLayout.displayName = 'DashboardLayout';

export { DashboardLayout };
