/**
 * Storage backend interface
 */

import type { Profile } from '../types/profile';
import type { ObfBoard } from '../types/obf';

export interface StorageBackend {
  /**
   * Load user profile
   */
  loadProfile(): Promise<Profile | null>;

  /**
   * Save user profile
   */
  saveProfile(profile: Profile): Promise<void>;

  /**
   * Load a board by ID (checks custom boards first, then default boards)
   */
  loadBoard(boardId: string): Promise<ObfBoard | null>;

  /**
   * Save a custom board (creates new or updates existing)
   */
  saveBoard(board: ObfBoard): Promise<void>;

  /**
   * Delete a custom board by ID
   */
  deleteBoard(boardId: string): Promise<void>;

  /**
   * List all custom boards
   */
  listCustomBoards(): Promise<ObfBoard[]>;

  /**
   * List all available default board IDs
   */
  listBoards(): Promise<string[]>;
}
