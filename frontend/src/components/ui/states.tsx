/**
 * State Components
 * 
 * Empty state, error state, and loading state components.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Fade, Slide } from '@/components/motion';

// ===========================================
// EMPTY STATE
// ===========================================

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, secondaryAction, className, ...props }, ref) => (
    <Fade>
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-12 text-center',
          className
        )}
        {...props}
      >
        {icon && (
          <div className="mb-4 rounded-full bg-muted p-4 text-muted-foreground">
            {icon}
          </div>
        )}
        
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        
        {description && (
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        )}
        
        {(action || secondaryAction) && (
          <div className="mt-6 flex gap-3">
            {action && (
              <Button onClick={action.onClick}>{action.label}</Button>
            )}
            {secondaryAction && (
              <Button variant="outline" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </Fade>
  )
);
EmptyState.displayName = 'EmptyState';

// ===========================================
// ERROR STATE
// ===========================================

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  error?: Error | string;
  onRetry?: () => void;
  onReport?: () => void;
}

const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  ({ title = 'Something went wrong', description, error, onRetry, onReport, className, ...props }, ref) => (
    <Slide direction="up">
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-12 text-center',
          className
        )}
        {...props}
      >
        {/* Error Icon */}
        <div className="mb-4 rounded-full bg-danger/10 p-4">
          <svg
            className="h-8 w-8 text-danger"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        
        {description && (
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        )}
        
        {error && process.env.NODE_ENV === 'development' && (
          <pre className="mt-4 max-w-md overflow-auto rounded-lg bg-muted p-4 text-left text-xs text-muted-foreground">
            {typeof error === 'string' ? error : error.message}
          </pre>
        )}
        
        <div className="mt-6 flex gap-3">
          {onRetry && (
            <Button onClick={onRetry}>Try Again</Button>
          )}
          {onReport && (
            <Button variant="outline" onClick={onReport}>
              Report Issue
            </Button>
          )}
        </div>
      </div>
    </Slide>
  )
);
ErrorState.displayName = 'ErrorState';

// ===========================================
// LOADING STATE
// ===========================================

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  showSpinner?: boolean;
}

const LoadingState = React.forwardRef<HTMLDivElement, LoadingStateProps>(
  ({ message = 'Loading...', showSpinner = true, className, ...props }, ref) => (
    <Fade>
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-12 text-center',
          className
        )}
        {...props}
      >
        {showSpinner && (
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        )}
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </Fade>
  )
);
LoadingState.displayName = 'LoadingState';

export { EmptyState, ErrorState, LoadingState };
