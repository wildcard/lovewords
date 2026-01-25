/**
 * Undo/Redo Hook
 *
 * Provides history management for board editing operations.
 * Supports undo, redo, and keyboard shortcuts (Ctrl+Z, Ctrl+Y).
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { ObfBoard } from '../types/obf';

export interface HistoryEntry {
  /** Timestamp of the action */
  timestamp: number;
  /** Description for screen readers and UI */
  description: string;
  /** Board state before the action (for undo) */
  previousState: ObfBoard;
  /** Board state after the action (for redo) */
  nextState: ObfBoard;
}

export interface UseUndoRedoOptions {
  /** Maximum number of history entries to keep */
  maxHistory?: number;
  /** Callback when undo/redo is performed */
  onStateChange?: (board: ObfBoard, description: string) => void;
  /** Whether undo/redo is enabled */
  enabled?: boolean;
}

export interface UseUndoRedoResult {
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
  /** Number of undo steps available */
  undoCount: number;
  /** Number of redo steps available */
  redoCount: number;
  /** Description of next undo action */
  undoDescription: string | null;
  /** Description of next redo action */
  redoDescription: string | null;
  /** Push a new action to history */
  pushHistory: (previousState: ObfBoard, nextState: ObfBoard, description: string) => void;
  /** Undo the last action */
  undo: () => ObfBoard | null;
  /** Redo the last undone action */
  redo: () => ObfBoard | null;
  /** Clear all history */
  clearHistory: () => void;
  /** Get current history state for debugging */
  getHistoryState: () => { past: number; future: number };
}

const DEFAULT_MAX_HISTORY = 50;

/**
 * Hook for managing undo/redo history
 */
export function useUndoRedo(options: UseUndoRedoOptions = {}): UseUndoRedoResult {
  const {
    maxHistory = DEFAULT_MAX_HISTORY,
    onStateChange,
    enabled = true,
  } = options;

  // Past actions (can be undone)
  const [past, setPast] = useState<HistoryEntry[]>([]);
  // Future actions (can be redone)
  const [future, setFuture] = useState<HistoryEntry[]>([]);

  // Ref for stable callback access
  const onStateChangeRef = useRef(onStateChange);
  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  }, [onStateChange]);

  /**
   * Push a new action to history
   */
  const pushHistory = useCallback(
    (previousState: ObfBoard, nextState: ObfBoard, description: string) => {
      if (!enabled) return;

      const entry: HistoryEntry = {
        timestamp: Date.now(),
        description,
        previousState,
        nextState,
      };

      setPast((prev) => {
        // Add new entry and trim to max size
        const newPast = [...prev, entry];
        if (newPast.length > maxHistory) {
          return newPast.slice(-maxHistory);
        }
        return newPast;
      });

      // Clear future when new action is performed
      setFuture([]);
    },
    [enabled, maxHistory]
  );

  /**
   * Undo the last action
   */
  const undo = useCallback((): ObfBoard | null => {
    if (!enabled || past.length === 0) return null;

    const lastEntry = past[past.length - 1];

    // Move entry from past to future
    setPast((prev) => prev.slice(0, -1));
    setFuture((prev) => [lastEntry, ...prev]);

    // Notify callback
    if (onStateChangeRef.current) {
      onStateChangeRef.current(lastEntry.previousState, `Undo: ${lastEntry.description}`);
    }

    return lastEntry.previousState;
  }, [enabled, past]);

  /**
   * Redo the last undone action
   */
  const redo = useCallback((): ObfBoard | null => {
    if (!enabled || future.length === 0) return null;

    const nextEntry = future[0];

    // Move entry from future to past
    setFuture((prev) => prev.slice(1));
    setPast((prev) => [...prev, nextEntry]);

    // Notify callback
    if (onStateChangeRef.current) {
      onStateChangeRef.current(nextEntry.nextState, `Redo: ${nextEntry.description}`);
    }

    return nextEntry.nextState;
  }, [enabled, future]);

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setPast([]);
    setFuture([]);
  }, []);

  /**
   * Get history state for debugging
   */
  const getHistoryState = useCallback(() => ({
    past: past.length,
    future: future.length,
  }), [past.length, future.length]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl/Cmd + Z (undo)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Check for Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z (redo)
      if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey)
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, undo, redo]);

  return {
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    undoCount: past.length,
    redoCount: future.length,
    undoDescription: past.length > 0 ? past[past.length - 1].description : null,
    redoDescription: future.length > 0 ? future[0].description : null,
    pushHistory,
    undo,
    redo,
    clearHistory,
    getHistoryState,
  };
}
