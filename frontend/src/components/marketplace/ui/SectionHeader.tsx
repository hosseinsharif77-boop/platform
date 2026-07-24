/**
 * Section Header Component
 * 
 * Reusable section header for marketplace pages.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  href?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function SectionHeader({ title, description, href, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-end justify-between', className)}>
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
      
      {href && (
        <Link
          href={href}
          className="text-sm font-medium text-primary hover:underline"
        >
          View All →
        </Link>
      )}
      
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm font-medium text-primary hover:underline"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export default SectionHeader;
