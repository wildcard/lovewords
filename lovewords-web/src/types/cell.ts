/**
 * Cell action types - what happens when a user clicks a cell
 *
 * This matches the Rust CellAction enum from lovewords-core
 */

export type CellAction =
  | { type: 'Speak'; text: string }
  | { type: 'Navigate'; boardId: string }
  | { type: 'Back' }
  | { type: 'Home' }
  | { type: 'Clear' }
  | { type: 'Backspace' }
  | { type: 'AddWord'; word: string }
  | { type: 'Empty' };

/**
 * Type guards for CellAction
 */
export function isSpeak(action: CellAction): action is { type: 'Speak'; text: string } {
  return action.type === 'Speak';
}

export function isNavigate(action: CellAction): action is { type: 'Navigate'; boardId: string } {
  return action.type === 'Navigate';
}

export function isBack(action: CellAction): action is { type: 'Back' } {
  return action.type === 'Back';
}

export function isHome(action: CellAction): action is { type: 'Home' } {
  return action.type === 'Home';
}

export function isClear(action: CellAction): action is { type: 'Clear' } {
  return action.type === 'Clear';
}

export function isBackspace(action: CellAction): action is { type: 'Backspace' } {
  return action.type === 'Backspace';
}

export function isAddWord(action: CellAction): action is { type: 'AddWord'; word: string } {
  return action.type === 'AddWord';
}

export function isEmpty(action: CellAction): action is { type: 'Empty' } {
  return action.type === 'Empty';
}
