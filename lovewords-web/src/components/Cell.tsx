/**
 * Cell component - displays a single button in the grid
 */

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ObfButton } from '../types/obf';

export interface CellProps {
  /** Unique ID for drag-and-drop (format: "row-col") */
  id?: string;
  /** Button data (undefined for empty cells) */
  button?: ObfButton;
  /** Image URL to display (data URL or external URL) */
  imageUrl?: string;
  /** Callback when cell is clicked */
  onClick: () => void;
  /** Whether this cell is focused (for keyboard navigation) */
  isFocused?: boolean;
  /** Whether this cell is highlighted by switch scanning */
  isScanHighlighted?: boolean;
  /** Whether this cell can be dragged (edit mode) */
  isDraggable?: boolean;
  /** Ref for focus management */
  cellRef?: React.RefObject<HTMLButtonElement>;
  /** Row index for ARIA grid (1-based) */
  rowIndex?: number;
  /** Column index for ARIA grid (1-based) */
  colIndex?: number;
}

export function Cell({
  id,
  button,
  imageUrl,
  onClick,
  isFocused,
  isScanHighlighted,
  isDraggable = false,
  cellRef,
  rowIndex,
  colIndex,
}: CellProps) {
  // Use sortable hook if draggable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id || '',
    disabled: !isDraggable || !button, // Only draggable if in edit mode and has a button
  });
  if (!button || button.hidden) {
    return (
      <div
        className="cell-button bg-gray-100 opacity-50 cursor-not-allowed"
        role="gridcell"
        aria-disabled="true"
        aria-hidden="true"
        aria-rowindex={rowIndex}
        aria-colindex={colIndex}
      />
    );
  }

  const backgroundColor = button.background_color || '#e0e0e0';
  const borderColor = button.border_color || undefined;

  // Apply drag-and-drop styles
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor,
    borderColor,
    borderWidth: borderColor ? '2px' : undefined,
  };

  return (
    <div ref={setNodeRef} role="gridcell" aria-rowindex={rowIndex} aria-colindex={colIndex}>
      <button
        ref={cellRef}
        {...(isDraggable ? { ...attributes, ...listeners } : {})}
        className={`cell-button ${isFocused ? 'ring-4 ring-blue-500' : ''} ${
          isScanHighlighted ? 'scan-highlight' : ''
        } ${isDraggable ? 'cursor-move' : ''}`}
        style={style}
        onClick={onClick}
        aria-label={button.vocalization || button.label}
        type="button"
      >
        {imageUrl ? (
          <div className="flex flex-col items-center justify-center gap-1 p-1">
            <img
              src={imageUrl}
              alt={button.label}
              className="max-w-[80px] max-h-[80px] object-contain"
            />
            <span className="text-sm font-medium">{button.label}</span>
          </div>
        ) : (
          <span>{button.label}</span>
        )}
      </button>
    </div>
  );
}
