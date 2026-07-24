/**
 * Admin Layout Component
 * 
 * Main layout for admin panel.
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';

interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminLayout({ children, className }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        isMobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <AdminNavbar
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
