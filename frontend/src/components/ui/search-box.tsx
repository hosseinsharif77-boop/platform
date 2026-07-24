/**
 * SearchBox Component
 * 
 * Advanced search input with command palette support.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface SearchBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  shortcuts?: string[];
  showCommandHint?: boolean;
}

const SearchBox = React.forwardRef<HTMLDivElement, SearchBoxProps>(
  (
    {
      placeholder = 'Search...',
      value: controlledValue,
      onChange,
      onSearch,
      onClear,
      shortcuts = [],
      showCommandHint = true,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState('');
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      onChange?.(newValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch?.(value);
    };

    const handleClear = () => {
      setInternalValue('');
      onChange?.('');
      onClear?.();
    };

    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            <Input
              type="search"
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              className="h-10 pl-10 pr-24"
            />

            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
              {value && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleClear}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              )}

              {showCommandHint && (
                <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Keyboard Shortcuts */}
        {shortcuts.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {shortcuts.map((shortcut, index) => (
              <Badge key={index} variant="secondary" className="cursor-pointer text-xs">
                {shortcut}
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  }
);
SearchBox.displayName = 'SearchBox';

export { SearchBox };
