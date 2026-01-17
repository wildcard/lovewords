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
   * Load a board by ID
   */
  loadBoard(boardId: string): Promise<ObfBoard | null>;

  /**
   * List all available board IDs
   */
  listBoards(): Promise<string[]>;
}
