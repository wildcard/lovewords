/**
 * localStorage implementation of StorageBackend
 */

import type { StorageBackend } from './types';
import type { Profile } from '../types/profile';
import type { ObfBoard } from '../types/obf';
import { DEFAULT_PROFILE } from '../types/profile';

const PROFILE_KEY = 'lovewords-profile';
const CUSTOM_BOARDS_KEY = 'lovewords-custom-boards';

/**
 * Custom error for storage quota exceeded
 */
export class StorageQuotaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageQuotaError';
  }
}

/**
 * Check if error is QuotaExceededError
 */
function isQuotaExceededError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === 'QuotaExceededError' ||
      // Firefox
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  );
}

/**
 * Get approximate localStorage usage
 */
export function getStorageUsage(): { used: number; limit: number; percentUsed: number } {
  let used = 0;
  try {
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }
  } catch (e) {
    // If we can't calculate, return conservative estimate
    used = 0;
  }

  // Estimate 5MB limit (most browsers)
  const limit = 5 * 1024 * 1024; // 5MB in bytes
  const percentUsed = Math.round((used / limit) * 100);

  return { used, limit, percentUsed };
}

export class LocalStorageBackend implements StorageBackend {
  async loadProfile(): Promise<Profile | null> {
    try {
      const json = localStorage.getItem(PROFILE_KEY);
      if (!json) {
        return null;
      }
      return JSON.parse(json) as Profile;
    } catch (error) {
      console.error('Failed to load profile from localStorage:', error);
      return null;
    }
  }

  async saveProfile(profile: Profile): Promise<void> {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      if (isQuotaExceededError(error)) {
        const { percentUsed } = getStorageUsage();
        throw new StorageQuotaError(
          `Storage quota exceeded (${percentUsed}% full). Please delete some custom boards or images to free up space.`
        );
      }
      console.error('Failed to save profile to localStorage:', error);
      throw error;
    }
  }

  async loadBoard(boardId: string): Promise<ObfBoard | null> {
    try {
      // Check custom boards first
      const customBoards = await this.listCustomBoards();
      const customBoard = customBoards.find((board) => board.id === boardId);
      if (customBoard) {
        return customBoard;
      }

      // Fallback to default boards from public/boards/ directory
      const response = await fetch(`/boards/${boardId}.json`);
      if (!response.ok) {
        console.error(`Board not found: ${boardId}`);
        return null;
      }
      return await response.json() as ObfBoard;
    } catch (error) {
      console.error(`Failed to load board ${boardId}:`, error);
      return null;
    }
  }

  async saveBoard(board: ObfBoard): Promise<void> {
    try {
      const customBoards = await this.listCustomBoards();
      const index = customBoards.findIndex((b) => b.id === board.id);

      if (index >= 0) {
        // Update existing board
        customBoards[index] = board;
      } else {
        // Add new board
        customBoards.push(board);
      }

      localStorage.setItem(CUSTOM_BOARDS_KEY, JSON.stringify(customBoards));
    } catch (error) {
      if (isQuotaExceededError(error)) {
        const { percentUsed } = getStorageUsage();
        throw new StorageQuotaError(
          `Storage quota exceeded (${percentUsed}% full). Cannot save board. Please delete old boards or remove images to free up space.`
        );
      }
      console.error('Failed to save custom board:', error);
      throw error;
    }
  }

  async deleteBoard(boardId: string): Promise<void> {
    try {
      const customBoards = await this.listCustomBoards();
      const filtered = customBoards.filter((board) => board.id !== boardId);
      localStorage.setItem(CUSTOM_BOARDS_KEY, JSON.stringify(filtered));
    } catch (error) {
      if (isQuotaExceededError(error)) {
        // This should rarely happen on delete, but handle it anyway
        throw new StorageQuotaError(
          'Storage error occurred while deleting board. Please try again.'
        );
      }
      console.error('Failed to delete custom board:', error);
      throw error;
    }
  }

  async listCustomBoards(): Promise<ObfBoard[]> {
    try {
      const json = localStorage.getItem(CUSTOM_BOARDS_KEY);
      if (!json) {
        return [];
      }
      return JSON.parse(json) as ObfBoard[];
    } catch (error) {
      console.error('Failed to list custom boards:', error);
      return [];
    }
  }

  async listBoards(): Promise<string[]> {
    // For now, hardcode the list of available boards
    // In a real app, you might fetch this from an API or manifest
    return ['love-and-affection', 'core-words', 'basic-needs', 'people', 'feelings', 'activities', 'questions', 'time'];
  }
}

/**
 * Get or create the default profile
 */
export async function getOrCreateProfile(storage: StorageBackend): Promise<Profile> {
  const profile = await storage.loadProfile();
  if (profile) {
    return profile;
  }

  // Create default profile
  await storage.saveProfile(DEFAULT_PROFILE);
  return DEFAULT_PROFILE;
}
