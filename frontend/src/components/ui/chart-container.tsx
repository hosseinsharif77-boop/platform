/**
 * ChartContainer Component
 * 
 * Reusable chart wrapper with loading and empty states.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/states';

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  headerAction?: React.ReactNode;
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  (
    {
      title,
      description,
      loading = false,
      empty = false,
      emptyMessage = 'No data available',
      headerAction,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Card ref={ref} className={cn('', className)} {...props}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {headerAction}
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : empty ? (
            <EmptyState
              title={emptyMessage}
              className="py-8"
            />
          ) : (
            children
          )}
        </CardContent>
      </Card>
    );
  }
);
ChartContainer.displayName = 'ChartContainer';

export { ChartContainer };
