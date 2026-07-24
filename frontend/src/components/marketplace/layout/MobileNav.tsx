/**
 * Mobile Navigation Component
 * 
 * Slide-out navigation for mobile devices.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
  className?: string;
}

export function MobileNav({ isOpen, onClose, categories, className }: MobileNavProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={onClose}
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[300px] transform bg-background transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <span className="text-sm font-bold">LP</span>
            </div>
            <span className="text-lg font-bold">Live Price</span>
          </Link>
          
          <Button variant="ghost" size="icon" onClick={onClose}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/marketplace"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                onClick={onClose}
              >
                Marketplace
              </Link>
            </li>
            <li>
              <Link
                href="/marketplace/stores"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                onClick={onClose}
              >
                Stores
              </Link>
            </li>
          </ul>

          {/* Categories */}
          <div className="mt-6">
            <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">
              Categories
            </h3>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category._id}>
                  <Link
                    href={`/marketplace/categories/${category.slug}`}
                    className="block rounded-lg px-4 py-2 text-sm text-foreground hover:bg-muted"
                    onClick={onClose}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}

export default MobileNav;
