/**
 * Marketplace Navbar Component
 * 
 * Main navigation bar for the marketplace.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SearchBar } from '../search/SearchBar';
import { MegaMenu } from './MegaMenu';
import { MobileNav } from './MobileNav';

interface NavbarProps {
  categories?: any[];
  className?: string;
}

export function Navbar({ categories = [], className }: NavbarProps) {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className={cn('sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60', className)}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <span className="text-sm font-bold">LP</span>
            </div>
            <span className="hidden text-lg font-bold sm:inline-block">Live Price</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/marketplace"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Marketplace
            </Link>
            
            <div
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Categories
                <svg
                  className={cn('h-4 w-4 transition-transform', isMegaMenuOpen && 'rotate-180')}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isMegaMenuOpen && (
                <MegaMenu
                  categories={categories}
                  onClose={() => setIsMegaMenuOpen(false)}
                />
              )}
            </div>

            <Link
              href="/marketplace/stores"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Stores
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <SearchBar />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>

            {/* Cart Button */}
            <Button variant="ghost" size="icon" className="relative">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Button>

            {/* User Menu */}
            <Button variant="ghost" size="icon">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-4 md:hidden">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
      />
    </header>
  );
}

export default Navbar;
