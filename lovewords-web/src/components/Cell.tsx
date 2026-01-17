/**
 * Cell component - displays a single button in the grid
 */

import type { ObfButton } from '../types/obf';

export interface CellProps {
  /** Button data (undefined for empty cells) */
  button?: ObfButton;
  /** Callback when cell is clicked */
  onClick: () => void;
  /** Whether this cell is focused (for keyboard navigation) */
  isFocused?: boolean;
  /** Ref for focus management */
  cellRef?: React.RefObject<HTMLButtonElement>;
}

export function Cell({ button, onClick, isFocused, cellRef }: CellProps) {
  if (!button || button.hidden) {
    return <div className="cell-button bg-gray-100 opacity-50 cursor-not-allowed" />;
  }

  const backgroundColor = button.background_color || '#e0e0e0';
  const borderColor = button.border_color || undefined;

  return (
    <button
      ref={cellRef}
      className={`cell-button ${isFocused ? 'ring-4 ring-blue-500' : ''}`}
      style={{
        backgroundColor,
        borderColor,
        borderWidth: borderColor ? '2px' : undefined,
      }}
      onClick={onClick}
      aria-label={button.vocalization || button.label}
      type="button"
    >
      {button.label}
    </button>
  );
}
