/**
 * BoardCreator component - Create new custom boards
 */

import { useState, useEffect } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import type { ObfBoard } from '../types/obf';

export interface BoardCreatorProps {
  /** Current board being edited (undefined for new board) */
  board?: ObfBoard;
  /** Callback when board is created/updated */
  onSave: (board: ObfBoard) => void;
  /** Callback to close creator */
  onClose: () => void;
}

interface GridSize {
  rows: number;
  columns: number;
  label: string;
}

const GRID_SIZES: GridSize[] = [
  { rows: 3, columns: 3, label: '3×3 (9 cells)' },
  { rows: 4, columns: 4, label: '4×4 (16 cells)' },
  { rows: 5, columns: 4, label: '5×4 (20 cells)' },
  { rows: 6, columns: 6, label: '6×6 (36 cells)' },
];

export function BoardCreator({ board, onSave, onClose }: BoardCreatorProps) {
  const [name, setName] = useState(board?.name || '');
  const [description, setDescription] = useState('');
  const [gridSize, setGridSize] = useState<GridSize>(GRID_SIZES[1]); // Default: 4×4
  const [errors, setErrors] = useState<{ name?: string }>({});

  const dialogRef = useFocusTrap<HTMLDivElement>({ active: true, onEscape: onClose });
  const isEditMode = !!board;

  // Initialize form when editing existing board
  useEffect(() => {
    if (board) {
      setName(board.name);
      setDescription(board.description || '');
      const matchingSize = GRID_SIZES.find(
        (size) => size.rows === board.grid.rows && size.columns === board.grid.columns
      );
      if (matchingSize) {
        setGridSize(matchingSize);
      }
    }
  }, [board]);

  // Handle Escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const validate = (): boolean => {
    const newErrors: { name?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Board name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Board name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Generate empty grid
    const emptyGrid = Array.from({ length: gridSize.rows }, () =>
      Array(gridSize.columns).fill(null)
    );

    // Create or update board
    const newBoard: ObfBoard = {
      format: 'open-board-0.1',
      id: board?.id || `custom-${Date.now()}`,
      name: name.trim(),
      locale: 'en-US',
      description: description.trim() || undefined,
      buttons: board?.buttons || [],
      images: board?.images || [],
      sounds: board?.sounds || [],
      grid: {
        rows: gridSize.rows,
        columns: gridSize.columns,
        order: emptyGrid,
      },
      ext_lovewords_custom: true,
      ext_lovewords_created_at: board?.ext_lovewords_created_at || new Date().toISOString(),
      ext_lovewords_updated_at: new Date().toISOString(),
    };

    onSave(newBoard);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="board-creator-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-4 rounded-t-lg">
          <h2 id="board-creator-title" className="text-2xl font-bold">
            {isEditMode ? 'Edit Board' : 'Create New Board'}
          </h2>
          <p className="text-sm opacity-90">
            {isEditMode ? 'Update board settings' : 'Create a custom communication board'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Board Name */}
          <div>
            <label htmlFor="board-name" className="block text-sm font-medium text-gray-700 mb-2">
              Board Name *
            </label>
            <input
              id="board-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="e.g., Family, Daily Needs, Romantic"
              autoFocus
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="board-description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              id="board-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What is this board for?"
              rows={2}
            />
          </div>

          {/* Grid Size */}
          <div>
            <label htmlFor="grid-size" className="block text-sm font-medium text-gray-700 mb-2">
              Grid Size
            </label>
            <select
              id="grid-size"
              value={GRID_SIZES.findIndex((size) => size === gridSize)}
              onChange={(e) => setGridSize(GRID_SIZES[parseInt(e.target.value)])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isEditMode} // Can't change grid size when editing
            >
              {GRID_SIZES.map((size, index) => (
                <option key={index} value={index}>
                  {size.label}
                </option>
              ))}
            </select>
            {isEditMode && (
              <p className="mt-1 text-xs text-gray-500">
                Grid size cannot be changed after creation
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isEditMode ? 'Save Changes' : 'Create Board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
