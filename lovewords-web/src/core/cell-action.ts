/**
 * Convert an OBF button into a CellAction
 *
 * This implements the same logic as the Rust get_cell_action() function
 */

import type { ObfButton } from '../types/obf';
import type { CellAction } from '../types/cell';

/**
 * Determine what action should occur when a cell is clicked
 *
 * @param button - The OBF button definition, or undefined for empty cells
 * @returns The action to perform
 */
export function getCellAction(button: ObfButton | undefined): CellAction {
  if (!button) {
    return { type: 'Empty' };
  }

  // Check for explicit action field
  if (button.action) {
    const action = button.action.toLowerCase();

    // OBF standard actions
    if (action === ':speak') {
      const text = button.vocalization || button.label;
      return { type: 'Speak', text };
    }
    if (action === ':back') {
      return { type: 'Back' };
    }
    if (action === ':home') {
      return { type: 'Home' };
    }
    if (action === ':clear') {
      return { type: 'Clear' };
    }
    if (action === ':backspace') {
      return { type: 'Backspace' };
    }
    if (action === ':add') {
      const word = button.vocalization || button.label;
      return { type: 'AddWord', word };
    }
  }

  // Check for load_board navigation
  if (button.load_board?.id) {
    return { type: 'Navigate', boardId: button.load_board.id };
  }

  // Default: speak the label/vocalization
  const text = button.vocalization || button.label;
  return { type: 'Speak', text };
}
