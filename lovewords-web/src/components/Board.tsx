/**
 * Board component - displays a grid of cells
 */

import { useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import type { ObfBoard } from '../types/obf';
import { getButton } from '../types/obf';
import { Cell } from './Cell';

export interface BoardProps {
  /** Board to display */
  board: ObfBoard;
  /** Callback when a cell is clicked */
  onCellClick: (row: number, col: number) => void;
  /** Current focused cell position (for keyboard navigation) */
  focusedCell?: { row: number; col: number };
  /** Current scan-highlighted cell position (for switch scanning) */
  scanHighlightedCell?: { row: number; col: number } | null;
  /** Whether edit mode is active (enables drag-and-drop) */
  isEditMode?: boolean;
  /** Callback when buttons are reordered */
  onReorder?: (newOrder: (string | null)[][]) => void;
}

export function Board({
  board,
  onCellClick,
  focusedCell,
  scanHighlightedCell,
  isEditMode = false,
  onReorder,
}: BoardProps) {
  const cellRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Configure sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts (prevents accidental drags)
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Focus the cell when focusedCell changes
  useEffect(() => {
    if (focusedCell) {
      const key = `${focusedCell.row}-${focusedCell.col}`;
      const element = cellRefs.current.get(key);
      element?.focus();
    }
  }, [focusedCell]);

  const { rows, columns, order } = board.grid;

  // Handle drag end - reorder buttons
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id || !onReorder) {
      return;
    }

    // Parse row and column from IDs (format: "row-col")
    const activeId = String(active.id);
    const overId = String(over.id);

    const [activeRow, activeCol] = activeId.split('-').map(Number);
    const [overRow, overCol] = overId.split('-').map(Number);

    // Clone the order array
    const newOrder = order.map(row => [...row]);

    // Swap the button IDs
    const temp = newOrder[activeRow][activeCol];
    newOrder[activeRow][activeCol] = newOrder[overRow][overCol];
    newOrder[overRow][overCol] = temp;

    // Call the parent handler to save
    onReorder(newOrder);
  }

  // Generate flat list of cell IDs for SortableContext
  const cellIds: string[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      cellIds.push(`${r}-${c}`);
    }
  }

  const gridContent = (
    <div
      className="grid gap-3 p-4 max-w-4xl mx-auto"
      style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
      role="grid"
      aria-label={`${board.name} communication board`}
    >
      {order.map((row, rowIndex) =>
        row.map((buttonId, colIndex) => {
          const button = buttonId ? getButton(board, buttonId) : undefined;
          const isFocused =
            focusedCell?.row === rowIndex && focusedCell?.col === colIndex;
          const isScanHighlighted =
            scanHighlightedCell?.row === rowIndex &&
            scanHighlightedCell?.col === colIndex;
          const key = `${rowIndex}-${colIndex}`;

          // Get image URL if button has an image
          let imageUrl: string | undefined;
          if (button?.image_id) {
            const image = board.images.find(img => img.id === button.image_id);
            imageUrl = image?.data || image?.url;
          }

          return (
            <Cell
              key={key}
              id={isEditMode ? key : undefined}
              button={button}
              imageUrl={imageUrl}
              onClick={() => onCellClick(rowIndex, colIndex)}
              isFocused={isFocused}
              isScanHighlighted={isScanHighlighted}
              isDraggable={isEditMode}
              cellRef={{
                current: cellRefs.current.get(key) || null,
              } as React.RefObject<HTMLButtonElement>}
              rowIndex={rowIndex + 1}
              colIndex={colIndex + 1}
            />
          );
        })
      )}
    </div>
  );

  // Wrap in DndContext if edit mode is enabled
  if (isEditMode && onReorder) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={cellIds} strategy={rectSortingStrategy}>
          {gridContent}
        </SortableContext>
      </DndContext>
    );
  }

  return gridContent;
}
