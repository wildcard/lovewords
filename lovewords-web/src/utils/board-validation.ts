/**
 * Board validation utilities for OBF format
 * Validates imported boards against the OBF 0.1 specification
 */

import type { ObfBoard } from '../types/obf';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  board?: ObfBoard;
}

/**
 * Validates that data conforms to the OBF board format
 *
 * Checks:
 * - Format version is "open-board-0.1"
 * - Required fields exist (id, name, buttons, images, sounds, grid)
 * - Grid dimensions match grid.order array dimensions
 * - All button IDs in grid.order exist in buttons array
 */
export function validateBoard(data: unknown): ValidationResult {
  const errors: string[] = [];

  // Check if data is an object
  if (typeof data !== 'object' || data === null) {
    return {
      valid: false,
      errors: ['Board data must be an object'],
    };
  }

  const board = data as Partial<ObfBoard>;

  // Validate format version
  if (!board.format) {
    errors.push('Missing required field: format');
  } else if (board.format !== 'open-board-0.1') {
    errors.push(`Invalid format version: ${board.format} (expected "open-board-0.1")`);
  }

  // Validate required fields
  if (!board.id) {
    errors.push('Missing required field: id');
  }
  if (!board.name) {
    errors.push('Missing required field: name');
  }
  if (!Array.isArray(board.buttons)) {
    errors.push('Missing or invalid field: buttons (must be an array)');
  }
  if (!Array.isArray(board.images)) {
    errors.push('Missing or invalid field: images (must be an array)');
  }
  if (!Array.isArray(board.sounds)) {
    errors.push('Missing or invalid field: sounds (must be an array)');
  }
  if (!board.grid || typeof board.grid !== 'object') {
    errors.push('Missing or invalid field: grid (must be an object)');
  }

  // If basic validation failed, return early
  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Validate grid structure
  const grid = board.grid!;
  if (typeof grid.rows !== 'number' || grid.rows <= 0) {
    errors.push('Grid rows must be a positive number');
  }
  if (typeof grid.columns !== 'number' || grid.columns <= 0) {
    errors.push('Grid columns must be a positive number');
  }
  if (!Array.isArray(grid.order)) {
    errors.push('Grid order must be an array');
  } else {
    // Validate grid dimensions match order array
    if (grid.order.length !== grid.rows) {
      errors.push(`Grid order has ${grid.order.length} rows, but grid.rows is ${grid.rows}`);
    }

    // Check each row has correct column count
    grid.order.forEach((row, rowIndex) => {
      if (!Array.isArray(row)) {
        errors.push(`Grid order row ${rowIndex} is not an array`);
      } else if (row.length !== grid.columns) {
        errors.push(`Grid order row ${rowIndex} has ${row.length} columns, but grid.columns is ${grid.columns}`);
      }
    });
  }

  // Validate button ID references
  if (Array.isArray(board.buttons) && Array.isArray(grid.order)) {
    const buttonIds = new Set(board.buttons.map(btn => btn.id));
    const referencedIds = new Set<string>();

    // Collect all button IDs referenced in grid
    grid.order.forEach((row, rowIndex) => {
      if (Array.isArray(row)) {
        row.forEach((buttonId, colIndex) => {
          if (buttonId !== null && buttonId !== undefined) {
            referencedIds.add(buttonId);
            if (!buttonIds.has(buttonId)) {
              errors.push(`Grid references unknown button ID "${buttonId}" at row ${rowIndex}, column ${colIndex}`);
            }
          }
        });
      }
    });
  }

  // Validate button structure
  if (Array.isArray(board.buttons)) {
    board.buttons.forEach((button, index) => {
      if (!button.id) {
        errors.push(`Button at index ${index} is missing required field: id`);
      }
      if (!button.label) {
        errors.push(`Button at index ${index} is missing required field: label`);
      }
    });
  }

  // Validate image structure
  if (Array.isArray(board.images)) {
    board.images.forEach((image, index) => {
      if (!image.id) {
        errors.push(`Image at index ${index} is missing required field: id`);
      }
      if (!image.url && !image.data) {
        errors.push(`Image at index ${index} must have either url or data field`);
      }
    });
  }

  // Validate sound structure
  if (Array.isArray(board.sounds)) {
    board.sounds.forEach((sound, index) => {
      if (!sound.id) {
        errors.push(`Sound at index ${index} is missing required field: id`);
      }
      if (!sound.url && !sound.data) {
        errors.push(`Sound at index ${index} must have either url or data field`);
      }
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    board: board as ObfBoard,
  };
}
