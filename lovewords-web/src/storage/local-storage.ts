/**
 * localStorage implementation of StorageBackend
 */

import type { StorageBackend } from './types';
import type { Profile } from '../types/profile';
import type { ObfBoard } from '../types/obf';
import { DEFAULT_PROFILE } from '../types/profile';

const PROFILE_KEY = 'lovewords-profile';

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
      console.error('Failed to save profile to localStorage:', error);
      throw error;
    }
  }

  async loadBoard(boardId: string): Promise<ObfBoard | null> {
    try {
      // Fetch from public/boards/ directory
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

  async listBoards(): Promise<string[]> {
    // For now, hardcode the list of available boards
    // In a real app, you might fetch this from an API or manifest
    return ['love-and-affection', 'core-words', 'basic-needs', 'feelings', 'activities', 'questions', 'time'];
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
