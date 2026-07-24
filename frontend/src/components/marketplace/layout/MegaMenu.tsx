/**
 * Mega Menu Component
 * 
 * Dropdown menu for categories navigation.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface MegaMenuProps {
  categories: any[];
  onClose: () => void;
  className?: string;
}

export function MegaMenu({ categories, onClose, className }: MegaMenuProps) {
  // Group categories into columns
  const columns = [
    categories.slice(0, Math.ceil(categories.length / 3)),
    categories.slice(Math.ceil(categories.length / 3), Math.ceil(categories.length / 3) * 2),
    categories.slice(Math.ceil(categories.length / 3) * 2),
  ];

  return (
    <div
      className={cn(
        'absolute left-1/2 top-full -translate-x-1/2 pt-2',
        className
      )}
      onMouseLeave={onClose}
    >
      <div className="w-[800px] rounded-lg border bg-background p-6 shadow-lg">
        <div className="grid grid-cols-3 gap-8">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="space-y-4">
              {column.map((category: any) => (
                <div key={category._id}>
                  <Link
                    href={`/marketplace/categories/${category.slug}`}
                    className="text-sm font-medium text-foreground hover:text-primary"
                    onClick={onClose}
                  >
                    {category.name}
                  </Link>
                  {category.children && category.children.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {category.children.slice(0, 4).map((child: any) => (
                        <li key={child._id}>
                          <Link
                            href={`/marketplace/categories/${child.slug}`}
                            className="text-sm text-muted-foreground hover:text-foreground"
                            onClick={onClose}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="mt-6 border-t pt-4">
          <Link
            href="/marketplace/categories"
            className="text-sm font-medium text-primary hover:underline"
            onClick={onClose}
          >
            View All Categories →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MegaMenu;
