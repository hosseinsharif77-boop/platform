/**
 * Use Keyboard Hook
 * 
 * Custom hook for keyboard shortcuts.
 */

'use client';

import { useEffect, useCallback } from 'react';

type KeyCombo = string | string[];

export function useKeyboard(
  key: KeyCombo,
  callback: () => void,
  options: {
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
    alt?: boolean;
    enabled?: boolean;
  } = {}
) {
  const { ctrl = false, meta = false, shift = false, alt = false, enabled = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const keyCombo = Array.isArray(key) ? key : [key];
      const pressedKey = event.key.toLowerCase();

      const isKeyMatch = keyCombo.some((k) => pressedKey === k.toLowerCase());
      const isModifierMatch =
        (!ctrl || event.ctrlKey) &&
        (!meta || event.metaKey) &&
        (!shift || event.shiftKey) &&
        (!alt || event.altKey);

      if (isKeyMatch && isModifierMatch) {
        event.preventDefault();
        callback();
      }
    },
    [key, callback, ctrl, meta, shift, alt, enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Hook for Command+K / Ctrl+K shortcut
 */
export function useCommandK(callback: () => void, enabled = true) {
  useKeyboard('k', callback, { meta: true, enabled });
  useKeyboard('k', callback, { ctrl: true, enabled });
}

/**
 * Hook for Escape key
 */
export function useEscape(callback: () => void, enabled = true) {
  useKeyboard('escape', callback, { enabled });
}
