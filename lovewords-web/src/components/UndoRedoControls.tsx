/**
 * Undo/Redo Controls Component
 *
 * Displays undo/redo buttons with tooltips showing descriptions.
 * Only visible in edit mode when editing a custom board.
 */

import { memo } from 'react';

export interface UndoRedoControlsProps {
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
  /** Description of next undo action */
  undoDescription: string | null;
  /** Description of next redo action */
  redoDescription: string | null;
  /** Callback to perform undo */
  onUndo: () => void;
  /** Callback to perform redo */
  onRedo: () => void;
  /** Number of undo steps available (optional, for display) */
  undoCount?: number;
  /** Number of redo steps available (optional, for display) */
  redoCount?: number;
}

/**
 * Undo/Redo button controls for edit mode
 */
export const UndoRedoControls = memo(function UndoRedoControls({
  canUndo,
  canRedo,
  undoDescription,
  redoDescription,
  onUndo,
  onRedo,
  undoCount,
  redoCount,
}: UndoRedoControlsProps) {
  return (
    <div className="flex items-center gap-1" role="toolbar" aria-label="Undo and redo controls">
      {/* Undo Button */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`
          p-2 rounded-md transition-colors
          ${canUndo
            ? 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
            : 'text-gray-300 cursor-not-allowed'
          }
        `}
        title={undoDescription ? `Undo: ${undoDescription} (Ctrl+Z)` : 'Nothing to undo'}
        aria-label={undoDescription ? `Undo ${undoDescription}` : 'Undo (nothing to undo)'}
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
        </svg>
        {undoCount !== undefined && undoCount > 0 && (
          <span className="sr-only">({undoCount} steps available)</span>
        )}
      </button>

      {/* Redo Button */}
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`
          p-2 rounded-md transition-colors
          ${canRedo
            ? 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
            : 'text-gray-300 cursor-not-allowed'
          }
        `}
        title={redoDescription ? `Redo: ${redoDescription} (Ctrl+Y)` : 'Nothing to redo'}
        aria-label={redoDescription ? `Redo ${redoDescription}` : 'Redo (nothing to redo)'}
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 7v6h-6" />
          <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
        </svg>
        {redoCount !== undefined && redoCount > 0 && (
          <span className="sr-only">({redoCount} steps available)</span>
        )}
      </button>
    </div>
  );
});
