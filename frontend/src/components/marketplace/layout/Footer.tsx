/**
 * Marketplace Footer Component
 * 
 * Footer for the marketplace.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn('border-t bg-muted/50', className)}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <span className="text-sm font-bold">LP</span>
              </div>
              <span className="text-lg font-bold">Live Price</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Modern multi-vendor marketplace with live dynamic pricing.
              Always up-to-date prices.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/marketplace" className="text-sm text-muted-foreground hover:text-foreground">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/marketplace/categories" className="text-sm text-muted-foreground hover:text-foreground">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/marketplace/stores" className="text-sm text-muted-foreground hover:text-foreground">
                  Stores
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {currentYear} Live Price Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
