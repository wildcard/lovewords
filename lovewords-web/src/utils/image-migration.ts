/**
 * Image Migration Utility
 *
 * Migrates embedded images from boards to the centralized image library.
 * Handles deduplication and updates button references.
 */

import { imageLibrary } from '../storage/image-library-backend';
import type { ObfBoard } from '../types/obf';

export interface MigrationResult {
  success: boolean;
  boardsProcessed: number;
  imagesAdded: number;
  imagesDeduplicated: number;
  buttonsUpdated: number;
  errors: string[];
}

export interface BoardMigrationResult {
  boardId: string;
  imagesAdded: number;
  imagesDeduplicated: number;
  buttonsUpdated: number;
  needsSave: boolean;
  error?: string;
}

const MIGRATION_VERSION_KEY = 'lovewords_image_migration_version';
const CURRENT_MIGRATION_VERSION = 1;

/**
 * Check if migration has already been run
 */
export function isMigrationComplete(): boolean {
  try {
    const version = localStorage.getItem(MIGRATION_VERSION_KEY);
    return version !== null && parseInt(version, 10) >= CURRENT_MIGRATION_VERSION;
  } catch {
    return false;
  }
}

/**
 * Mark migration as complete
 */
export function markMigrationComplete(): void {
  try {
    localStorage.setItem(MIGRATION_VERSION_KEY, String(CURRENT_MIGRATION_VERSION));
  } catch (err) {
    console.error('Failed to mark migration complete:', err);
  }
}

/**
 * Migrate a single board's embedded images to the library
 *
 * Returns a modified board with updated button references.
 * Does NOT save the board - caller is responsible for saving.
 */
export async function migrateBoard(board: ObfBoard): Promise<{
  migratedBoard: ObfBoard;
  result: BoardMigrationResult;
}> {
  const result: BoardMigrationResult = {
    boardId: board.id,
    imagesAdded: 0,
    imagesDeduplicated: 0,
    buttonsUpdated: 0,
    needsSave: false,
  };

  // Skip non-custom boards (they don't have embedded images)
  if (!board.ext_lovewords_custom) {
    return { migratedBoard: board, result };
  }

  // Clone the board to avoid mutation
  const migratedBoard: ObfBoard = {
    ...board,
    buttons: board.buttons.map((btn) => ({ ...btn })),
    images: [...board.images],
  };

  // Build a map of image_id -> dataUrl from board.images
  const imageDataMap = new Map<string, string>();
  for (const img of board.images) {
    const dataUrl = img.data || img.url;
    if (img.id && dataUrl && dataUrl.startsWith('data:')) {
      imageDataMap.set(img.id, dataUrl);
    }
  }

  // Process each button that has an image_id but no imageLibraryId
  for (const button of migratedBoard.buttons) {
    if (button.image_id && !button.imageLibraryId) {
      const dataUrl = imageDataMap.get(button.image_id);

      if (dataUrl) {
        try {
          // Add image to library (handles deduplication internally)
          const addResult = await imageLibrary.addImage(dataUrl, {
            name: `${board.name} - ${button.label}`,
            tags: ['migrated', board.id],
          });

          if (addResult.success && addResult.imageId) {
            // Update button to use library reference
            button.imageLibraryId = addResult.imageId;

            // Increment usage count
            await imageLibrary.incrementUsage(addResult.imageId);

            result.buttonsUpdated++;
            result.needsSave = true;

            if (addResult.isDuplicate) {
              result.imagesDeduplicated++;
            } else {
              result.imagesAdded++;
            }
          }
        } catch (err) {
          console.error(`Failed to migrate image for button ${button.id}:`, err);
          result.error = `Failed to migrate some images: ${err}`;
        }
      }
    }
  }

  return { migratedBoard, result };
}

/**
 * Migrate all custom boards' embedded images to the library
 *
 * @param loadBoards - Function to load all custom boards
 * @param saveBoard - Function to save a modified board
 * @param options - Migration options
 */
export async function migrateAllBoards(
  loadBoards: () => Promise<ObfBoard[]>,
  saveBoard: (board: ObfBoard) => Promise<void>,
  options: { force?: boolean } = {}
): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: true,
    boardsProcessed: 0,
    imagesAdded: 0,
    imagesDeduplicated: 0,
    buttonsUpdated: 0,
    errors: [],
  };

  // Check if migration already complete
  if (!options.force && isMigrationComplete()) {
    return result;
  }

  try {
    const boards = await loadBoards();

    for (const board of boards) {
      try {
        const { migratedBoard, result: boardResult } = await migrateBoard(board);

        result.boardsProcessed++;
        result.imagesAdded += boardResult.imagesAdded;
        result.imagesDeduplicated += boardResult.imagesDeduplicated;
        result.buttonsUpdated += boardResult.buttonsUpdated;

        // Save board if it was modified
        if (boardResult.needsSave) {
          await saveBoard(migratedBoard);
        }

        if (boardResult.error) {
          result.errors.push(`${board.name}: ${boardResult.error}`);
        }
      } catch (err) {
        console.error(`Failed to migrate board ${board.id}:`, err);
        result.errors.push(`${board.name}: ${err}`);
      }
    }

    // Mark migration complete
    markMigrationComplete();

    if (result.errors.length > 0) {
      result.success = false;
    }
  } catch (err) {
    console.error('Migration failed:', err);
    result.success = false;
    result.errors.push(`Migration failed: ${err}`);
  }

  return result;
}

/**
 * Reset migration status (for testing or re-running migration)
 */
export function resetMigrationStatus(): void {
  try {
    localStorage.removeItem(MIGRATION_VERSION_KEY);
  } catch {
    // Ignore errors
  }
}
