/**
 * Board navigation state machine
 *
 * Manages the navigation stack and current board state
 */

import type { ObfBoard } from '../types/obf';

export interface NavigationState {
  /** Current board being displayed */
  currentBoard: ObfBoard;
  /** Navigation history stack (board IDs) */
  stack: string[];
  /** Accumulated message words */
  message: string[];
}

export class BoardNavigator {
  private state: NavigationState;
  private boards: Map<string, ObfBoard>;

  constructor(homeBoard: ObfBoard) {
    this.state = {
      currentBoard: homeBoard,
      stack: [],
      message: [],
    };
    this.boards = new Map([[homeBoard.id, homeBoard]]);
  }

  /**
   * Get the current navigation state
   */
  getState(): NavigationState {
    return { ...this.state };
  }

  /**
   * Register a board for navigation
   */
  registerBoard(board: ObfBoard): void {
    this.boards.set(board.id, board);
  }

  /**
   * Navigate to a different board
   */
  navigate(boardId: string): boolean {
    const board = this.boards.get(boardId);
    if (!board) {
      console.error(`Board not found: ${boardId}`);
      return false;
    }

    // Push current board ID to stack
    this.state.stack.push(this.state.currentBoard.id);
    this.state.currentBoard = board;
    return true;
  }

  /**
   * Navigate back to previous board
   */
  back(): boolean {
    if (this.state.stack.length === 0) {
      return false;
    }

    const previousBoardId = this.state.stack.pop()!;
    const board = this.boards.get(previousBoardId);
    if (!board) {
      console.error(`Previous board not found: ${previousBoardId}`);
      return false;
    }

    this.state.currentBoard = board;
    return true;
  }

  /**
   * Navigate to home board
   */
  home(): boolean {
    if (this.state.stack.length === 0) {
      return false; // Already at home
    }

    // Get the first board in the stack (home)
    const homeBoardId = this.state.stack[0];
    const homeBoard = this.boards.get(homeBoardId);
    if (!homeBoard) {
      console.error(`Home board not found: ${homeBoardId}`);
      return false;
    }

    this.state.stack = [];
    this.state.currentBoard = homeBoard;
    return true;
  }

  /**
   * Add a word to the accumulated message
   */
  addWord(word: string): void {
    this.state.message.push(word);
  }

  /**
   * Remove the last word from the message
   */
  backspace(): void {
    this.state.message.pop();
  }

  /**
   * Clear the entire message
   */
  clearMessage(): void {
    this.state.message = [];
  }

  /**
   * Get the current message as a string
   */
  getMessage(): string {
    return this.state.message.join(' ');
  }

  /**
   * Check if we can navigate back
   */
  canGoBack(): boolean {
    return this.state.stack.length > 0;
  }

  /**
   * Get breadcrumb trail (for UI display)
   */
  getBreadcrumbs(): string[] {
    return this.state.stack.map(id => {
      const board = this.boards.get(id);
      return board?.name || id;
    }).concat(this.state.currentBoard.name);
  }
}
