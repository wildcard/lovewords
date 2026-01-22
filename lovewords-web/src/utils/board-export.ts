/**
 * Board export utilities for OBF format
 * Handles serializing boards to JSON and triggering downloads
 */

import type { ObfBoard } from '../types/obf';

/**
 * Generate a filename from a board name
 * Sanitizes the name and adds .obf extension
 *
 * @example
 * generateFilename({ name: "My Board" }) -> "my-board.obf"
 */
export function generateFilename(board: ObfBoard): string {
  // Sanitize board name for filename:
  // - Convert to lowercase
  // - Replace spaces and special chars with hyphens
  // - Remove consecutive hyphens
  // - Trim hyphens from start/end
  const sanitized = board.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return `${sanitized || 'board'}.obf`;
}

/**
 * Export a board as an OBF file and trigger download
 *
 * Creates a JSON blob with pretty-printed formatting and
 * triggers a browser download using a temporary anchor element.
 *
 * @param board - The board to export
 * @param filename - Optional custom filename (defaults to board name)
 */
export function downloadBoard(board: ObfBoard, filename?: string): void {
  // Serialize board to pretty JSON
  const json = JSON.stringify(board, null, 2);

  // Create blob with JSON MIME type
  const blob = new Blob([json], { type: 'application/json' });

  // Create object URL for the blob
  const url = URL.createObjectURL(blob);

  // Create hidden anchor element
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename || generateFilename(board);
  anchor.style.display = 'none';

  // Append to body, click, and clean up
  document.body.appendChild(anchor);
  anchor.click();

  // Clean up after a short delay to ensure download started
  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 100);
}
