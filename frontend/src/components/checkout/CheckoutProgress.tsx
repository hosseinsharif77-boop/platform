/**
 * Checkout Progress Component
 * 
 * Displays checkout step progress.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CheckoutProgressProps {
  currentStep: string;
  steps: { id: string; label: string }[];
  className?: string;
}

export function CheckoutProgress({ currentStep, steps, className }: CheckoutProgressProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className={cn('flex items-center justify-center', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isUpcoming = index > currentIndex;

        return (
          <React.Fragment key={step.id}>
            {/* Step */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
                  isCompleted && 'border-success bg-success text-white',
                  isCurrent && 'border-primary bg-primary text-primary-foreground',
                  isUpcoming && 'border-muted bg-background text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium',
                  isCurrent ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'mx-2 h-0.5 w-12 sm:w-20',
                  isCompleted ? 'bg-success' : 'bg-muted'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default CheckoutProgress;
