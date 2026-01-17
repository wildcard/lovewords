/**
 * Board component - displays a grid of cells
 */

import { useRef, useEffect } from 'react';
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
}

export function Board({ board, onCellClick, focusedCell }: BoardProps) {
  const cellRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Focus the cell when focusedCell changes
  useEffect(() => {
    if (focusedCell) {
      const key = `${focusedCell.row}-${focusedCell.col}`;
      const element = cellRefs.current.get(key);
      element?.focus();
    }
  }, [focusedCell]);

  const { rows, columns, order } = board.grid;

  return (
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
          const key = `${rowIndex}-${colIndex}`;

          return (
            <Cell
              key={key}
              button={button}
              onClick={() => onCellClick(rowIndex, colIndex)}
              isFocused={isFocused}
              cellRef={{
                current: cellRefs.current.get(key) || null,
              } as React.RefObject<HTMLButtonElement>}
            />
          );
        })
      )}
    </div>
  );
}
