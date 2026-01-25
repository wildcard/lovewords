/**
 * Tests for useUndoRedo hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUndoRedo } from '../useUndoRedo';
import type { ObfBoard } from '../../types/obf';

// Helper to create test boards
const createTestBoard = (id: string, name: string): ObfBoard => ({
  format: 'open-board-0.1',
  id,
  name,
  locale: 'en',
  buttons: [],
  images: [],
  sounds: [],
  grid: { rows: 2, columns: 2, order: [[null, null], [null, null]] },
  ext_lovewords_custom: true,
});

describe('useUndoRedo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with empty history', () => {
      const { result } = renderHook(() => useUndoRedo());

      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
      expect(result.current.undoCount).toBe(0);
      expect(result.current.redoCount).toBe(0);
      expect(result.current.undoDescription).toBeNull();
      expect(result.current.redoDescription).toBeNull();
    });
  });

  describe('pushHistory', () => {
    it('should enable undo after pushing', () => {
      const { result } = renderHook(() => useUndoRedo());
      const board1 = createTestBoard('1', 'Board 1');
      const board2 = createTestBoard('2', 'Board 2');

      act(() => {
        result.current.pushHistory(board1, board2, 'Test action');
      });

      expect(result.current.canUndo).toBe(true);
      expect(result.current.undoCount).toBe(1);
      expect(result.current.undoDescription).toBe('Test action');
    });

    it('should clear redo stack when pushing new action', () => {
      const { result } = renderHook(() => useUndoRedo());
      const board1 = createTestBoard('1', 'Board 1');
      const board2 = createTestBoard('2', 'Board 2');
      const board3 = createTestBoard('3', 'Board 3');

      // Push first action
      act(() => {
        result.current.pushHistory(board1, board2, 'Action 1');
      });

      // Undo it
      act(() => {
        result.current.undo();
      });

      expect(result.current.canRedo).toBe(true);

      // Push new action
      act(() => {
        result.current.pushHistory(board1, board3, 'Action 2');
      });

      // Redo should be cleared
      expect(result.current.canRedo).toBe(false);
    });

    it('should respect maxHistory option', () => {
      const { result } = renderHook(() => useUndoRedo({ maxHistory: 3 }));

      // Push 5 actions
      for (let i = 0; i < 5; i++) {
        const prev = createTestBoard(`${i}`, `Board ${i}`);
        const next = createTestBoard(`${i + 1}`, `Board ${i + 1}`);
        act(() => {
          result.current.pushHistory(prev, next, `Action ${i}`);
        });
      }

      // Should only have 3 in history
      expect(result.current.undoCount).toBe(3);
    });

    it('should not push when disabled', () => {
      const { result } = renderHook(() => useUndoRedo({ enabled: false }));
      const board1 = createTestBoard('1', 'Board 1');
      const board2 = createTestBoard('2', 'Board 2');

      act(() => {
        result.current.pushHistory(board1, board2, 'Test action');
      });

      expect(result.current.canUndo).toBe(false);
    });
  });

  describe('undo', () => {
    it('should return previous state', () => {
      const { result } = renderHook(() => useUndoRedo());
      const board1 = createTestBoard('1', 'Board 1');
      const board2 = createTestBoard('2', 'Board 2');

      act(() => {
        result.current.pushHistory(board1, board2, 'Test action');
      });

      let undoneBoard: ObfBoard | null = null;
      act(() => {
        undoneBoard = result.current.undo();
      });

      expect(undoneBoard).toEqual(board1);
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(true);
    });

    it('should return null when nothing to undo', () => {
      const { result } = renderHook(() => useUndoRedo());

      let undoneBoard: ObfBoard | null = null;
      act(() => {
        undoneBoard = result.current.undo();
      });

      expect(undoneBoard).toBeNull();
    });

    it('should call onStateChange callback', () => {
      const onStateChange = vi.fn();
      const { result } = renderHook(() => useUndoRedo({ onStateChange }));
      const board1 = createTestBoard('1', 'Board 1');
      const board2 = createTestBoard('2', 'Board 2');

      act(() => {
        result.current.pushHistory(board1, board2, 'Test action');
      });

      act(() => {
        result.current.undo();
      });

      expect(onStateChange).toHaveBeenCalledWith(board1, 'Undo: Test action');
    });
  });

  describe('redo', () => {
    it('should return next state', () => {
      const { result } = renderHook(() => useUndoRedo());
      const board1 = createTestBoard('1', 'Board 1');
      const board2 = createTestBoard('2', 'Board 2');

      act(() => {
        result.current.pushHistory(board1, board2, 'Test action');
      });

      act(() => {
        result.current.undo();
      });

      let redoneBoard: ObfBoard | null = null;
      act(() => {
        redoneBoard = result.current.redo();
      });

      expect(redoneBoard).toEqual(board2);
      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(false);
    });

    it('should return null when nothing to redo', () => {
      const { result } = renderHook(() => useUndoRedo());

      let redoneBoard: ObfBoard | null = null;
      act(() => {
        redoneBoard = result.current.redo();
      });

      expect(redoneBoard).toBeNull();
    });

    it('should call onStateChange callback', () => {
      const onStateChange = vi.fn();
      const { result } = renderHook(() => useUndoRedo({ onStateChange }));
      const board1 = createTestBoard('1', 'Board 1');
      const board2 = createTestBoard('2', 'Board 2');

      act(() => {
        result.current.pushHistory(board1, board2, 'Test action');
      });

      act(() => {
        result.current.undo();
      });

      onStateChange.mockClear();

      act(() => {
        result.current.redo();
      });

      expect(onStateChange).toHaveBeenCalledWith(board2, 'Redo: Test action');
    });
  });

  describe('clearHistory', () => {
    it('should clear all history', () => {
      const { result } = renderHook(() => useUndoRedo());
      const board1 = createTestBoard('1', 'Board 1');
      const board2 = createTestBoard('2', 'Board 2');

      act(() => {
        result.current.pushHistory(board1, board2, 'Action 1');
        result.current.pushHistory(board1, board2, 'Action 2');
      });

      act(() => {
        result.current.undo();
      });

      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(true);

      act(() => {
        result.current.clearHistory();
      });

      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
      expect(result.current.undoCount).toBe(0);
      expect(result.current.redoCount).toBe(0);
    });
  });

  describe('getHistoryState', () => {
    it('should return correct counts', () => {
      const { result } = renderHook(() => useUndoRedo());
      const board1 = createTestBoard('1', 'Board 1');
      const board2 = createTestBoard('2', 'Board 2');

      act(() => {
        result.current.pushHistory(board1, board2, 'Action 1');
        result.current.pushHistory(board1, board2, 'Action 2');
      });

      act(() => {
        result.current.undo();
      });

      const state = result.current.getHistoryState();
      expect(state.past).toBe(1);
      expect(state.future).toBe(1);
    });
  });

  describe('multiple undo/redo operations', () => {
    it('should handle multiple undo/redo correctly', () => {
      const { result } = renderHook(() => useUndoRedo());
      const boards = [
        createTestBoard('1', 'Board 1'),
        createTestBoard('2', 'Board 2'),
        createTestBoard('3', 'Board 3'),
        createTestBoard('4', 'Board 4'),
      ];

      // Push 3 actions
      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.pushHistory(boards[i], boards[i + 1], `Action ${i + 1}`);
        });
      }

      expect(result.current.undoCount).toBe(3);

      // Undo twice
      act(() => {
        result.current.undo();
        result.current.undo();
      });

      expect(result.current.undoCount).toBe(1);
      expect(result.current.redoCount).toBe(2);

      // Redo once
      act(() => {
        result.current.redo();
      });

      expect(result.current.undoCount).toBe(2);
      expect(result.current.redoCount).toBe(1);
    });
  });
});
