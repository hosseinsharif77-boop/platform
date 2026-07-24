/**
 * GlassCard Component
 * 
 * Premium glass morphism card with blur effects.
 * Inspired by modern SaaS interfaces like Arc Browser and Linear.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const glassCardVariants = cva(
  'rounded-xl transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'glass',
        light: 'glass-subtle',
        primary: 'bg-primary/10 backdrop-blur-md border border-primary/20',
        accent: 'bg-accent/10 backdrop-blur-md border border-accent/20',
        dark: 'bg-secondary-900/70 backdrop-blur-md border border-white/10',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      hover: {
        none: '',
        lift: 'hover:-translate-y-1 hover:shadow-lg',
        glow: 'hover:shadow-glow',
        scale: 'hover:scale-[1.02]',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      hover: 'none',
    },
  }
);

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, padding, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(glassCardVariants({ variant, padding, hover }), className)}
      {...props}
    />
  )
);
GlassCard.displayName = 'GlassCard';

export { GlassCard, glassCardVariants };
