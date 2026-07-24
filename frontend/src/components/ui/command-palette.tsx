/**
 * Command Palette Component
 * 
 * Quick access command palette (Cmd+K style).
 * Inspired by Linear, Raycast, and Arc Browser.
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/motion';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  group?: string;
  onSelect?: () => void;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
  onSelect?: (item: CommandItem) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  items,
  placeholder = 'Type a command or search...',
  onSelect,
}) => {
  const [query, setQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Filter items based on query
  const filteredItems = React.useMemo(() => {
    if (!query) return items;
    
    const lowerQuery = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery)
    );
  }, [items, query]);

  // Group items
  const groupedItems = React.useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    
    filteredItems.forEach((item) => {
      const group = item.group || 'Suggestions';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
    });
    
    return groups;
  }, [filteredItems]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex]);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  const handleSelect = (item: CommandItem) => {
    onSelect?.(item);
    item.onSelect?.();
    onClose();
    setQuery('');
    setSelectedIndex(0);
  };

  // Reset on open
  React.useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-lg rounded-xl bg-background shadow-2xl">
        {/* Search Input */}
        <div className="flex items-center border-b border-border px-4">
          <svg
            className="h-5 w-5 text-muted-foreground"
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
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-12 border-0 bg-transparent px-3 text-base focus:outline-none focus:ring-0 focus:ring-offset-0"
          />
          <Badge variant="secondary" className="text-xs">
            esc
          </Badge>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          ) : (
            Object.entries(groupedItems).map(([group, items]) => (
              <div key={group} className="mb-2">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  {group}
                </div>
                {items.map((item) => {
                  const globalIndex = filteredItems.indexOf(item);
                  return (
                    <button
                      key={item.id}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        globalIndex === selectedIndex
                          ? 'bg-accent text-accent-foreground'
                          : 'text-foreground hover:bg-muted'
                      )}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                    >
                      {item.icon && (
                        <span className="flex-shrink-0 text-muted-foreground">
                          {item.icon}
                        </span>
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground">
                            {item.description}
                          </div>
                        )}
                      </div>
                      {item.shortcut && (
                        <div className="flex gap-1">
                          {item.shortcut.map((key, i) => (
                            <kbd
                              key={i}
                              className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-muted px-1">↑</kbd>
              <kbd className="rounded border bg-muted px-1">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-muted px-1">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="rounded border bg-muted px-1">esc</kbd>
            <span>to close</span>
          </span>
        </div>
      </div>
    </Modal>
  );
};

export { CommandPalette };
