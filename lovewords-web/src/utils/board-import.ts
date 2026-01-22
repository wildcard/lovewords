/**
 * Board import utilities for OBF format
 * Handles importing boards from files and URLs, with validation and collision handling
 */

import type { ObfBoard } from '../types/obf';
import { validateBoard } from './board-validation';

export interface ImportResult {
  success: boolean;
  board?: ObfBoard;
  error?: string;
}

/**
 * Import a board from a file
 *
 * @param file - The .obf file to import
 * @returns Promise with import result
 */
export async function importFromFile(file: File): Promise<ImportResult> {
  try {
    // Read file contents as text
    const text = await file.text();

    // Parse JSON
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      return {
        success: false,
        error: 'The file is not valid JSON.',
      };
    }

    // Validate OBF structure
    const validation = validateBoard(data);
    if (!validation.valid) {
      return {
        success: false,
        error: `Invalid board format. ${validation.errors.join(', ')}`,
      };
    }

    return {
      success: true,
      board: validation.board,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Import a board from a URL
 *
 * @param url - URL to fetch the .obf file from
 * @returns Promise with import result
 */
export async function importFromUrl(url: string): Promise<ImportResult> {
  try {
    // Fetch the URL
    const response = await fetch(url);

    if (!response.ok) {
      return {
        success: false,
        error: `Could not fetch board from URL. Status: ${response.status}`,
      };
    }

    // Parse JSON
    let data: unknown;
    try {
      data = await response.json();
    } catch (parseError) {
      return {
        success: false,
        error: 'The URL did not return valid JSON.',
      };
    }

    // Validate OBF structure
    const validation = validateBoard(data);
    if (!validation.valid) {
      return {
        success: false,
        error: `Invalid board format. ${validation.errors.join(', ')}`,
      };
    }

    return {
      success: true,
      board: validation.board,
    };
  } catch (error) {
    return {
      success: false,
      error: `Could not fetch board from URL: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Process an imported board to handle ID collisions and set metadata
 *
 * @param board - The board to process
 * @param existingIds - Array of existing board IDs
 * @param strategy - How to handle ID collisions ('rename' or 'replace')
 * @returns Processed board ready for storage
 */
export function processImportedBoard(
  board: ObfBoard,
  existingIds: string[],
  strategy: 'rename' | 'replace'
): ObfBoard {
  const processed = { ...board };

  // Handle ID collision
  if (existingIds.includes(board.id) && strategy === 'rename') {
    // Append timestamp to make ID unique
    const timestamp = Date.now();
    processed.id = `${board.id}-${timestamp}`;
  }

  // Mark as custom board
  processed.ext_lovewords_custom = true;

  // Set timestamps
  const now = new Date().toISOString();
  if (!processed.ext_lovewords_created_at) {
    processed.ext_lovewords_created_at = now;
  }
  processed.ext_lovewords_updated_at = now;

  return processed;
}

/**
 * Check if a board ID already exists
 *
 * @param boardId - The board ID to check
 * @param existingIds - Array of existing board IDs
 * @returns True if the ID exists
 */
export function hasIdCollision(boardId: string, existingIds: string[]): boolean {
  return existingIds.includes(boardId);
}
