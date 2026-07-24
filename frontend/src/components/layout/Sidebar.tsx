/**
 * Sidebar Component
 * 
 * Responsive sidebar navigation for dashboards.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export interface SidebarItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  isActive?: boolean;
  onClick?: () => void;
  children?: SidebarItem[];
}

export interface SidebarProps extends React.HTMLAttributes<aside> {
  items: SidebarItem[];
  footer?: React.ReactNode;
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar = React.forwardRef<aside, SidebarProps>(
  ({ items, footer, collapsed = false, onToggle, className, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          'flex h-full flex-col border-r border-border bg-card transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <span className="text-sm font-bold">LP</span>
              </div>
              <span className="text-lg font-bold text-foreground">Live Price</span>
            </a>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8"
          >
            <svg
              className={cn(
                'h-4 w-4 transition-transform',
                collapsed && 'rotate-180'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {items.map((item, index) => (
              <SidebarItemComponent
                key={index}
                item={item}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </ScrollArea>

        {/* Footer */}
        {footer && (
          <>
            <Separator />
            <div className="p-4">{footer}</div>
          </>
        )}
      </aside>
    );
  }
);
Sidebar.displayName = 'Sidebar';

// ===========================================
// SIDEBAR ITEM
// ===========================================

interface SidebarItemComponentProps {
  item: SidebarItem;
  collapsed: boolean;
  level?: number;
}

const SidebarItemComponent: React.FC<SidebarItemComponentProps> = ({
  item,
  collapsed,
  level = 0,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <Button
        variant={item.isActive ? 'secondary' : 'ghost'}
        className={cn(
          'w-full justify-start gap-3',
          collapsed && 'justify-center px-0',
          item.isActive && 'bg-primary/10 text-primary',
          level > 0 && !collapsed && 'ml-4'
        )}
        onClick={() => {
          if (hasChildren) {
            setIsOpen(!isOpen);
          } else {
            item.onClick?.();
          }
        }}
      >
        {item.icon && (
          <span className="flex-shrink-0">{item.icon}</span>
        )}
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
            {hasChildren && (
              <svg
                className={cn(
                  'h-4 w-4 transition-transform',
                  isOpen && 'rotate-90'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </>
        )}
      </Button>

      {/* Children */}
      {hasChildren && isOpen && !collapsed && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child, index) => (
            <SidebarItemComponent
              key={index}
              item={child}
              collapsed={collapsed}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { Sidebar };
