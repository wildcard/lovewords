/**
 * Board export utilities for OBF format
 * Handles serializing boards to JSON and triggering downloads
 */

import JSZip from 'jszip';
import type { ObfBoard } from '../types/obf';

/**
 * Manifest structure for board export archives
 */
export interface BoardManifest {
  version: string;
  exported: string;
  boards: Array<{
    id: string;
    name: string;
    created?: string;
    buttons: number;
    grid: {
      rows: number;
      columns: number;
    };
  }>;
}

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

/**
 * Create a manifest.json file content for board exports
 *
 * @param boards - Array of boards to include in manifest
 * @returns Manifest object
 */
function createManifest(boards: ObfBoard[]): BoardManifest {
  return {
    version: '1.0',
    exported: new Date().toISOString(),
    boards: boards.map(board => ({
      id: board.id,
      name: board.name,
      created: board.ext_lovewords_created_at,
      buttons: board.buttons.length,
      grid: {
        rows: board.grid.rows,
        columns: board.grid.columns,
      },
    })),
  };
}

/**
 * Helper to download a blob with a given filename
 *
 * @param blob - The blob to download
 * @param filename - The filename for the download
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';

  document.body.appendChild(anchor);
  anchor.click();

  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Export all boards as a single ZIP file
 *
 * Creates a ZIP archive containing:
 * - Each board as a separate .obf file
 * - A manifest.json with metadata
 *
 * The ZIP filename includes a timestamp for version control.
 *
 * @param boards - Array of boards to export
 * @param onProgress - Optional callback for progress updates (0-100)
 * @returns Promise that resolves when download starts
 *
 * @example
 * await exportAllBoards(customBoards, (progress) => {
 *   console.log(`${progress}% complete`);
 * });
 */
export async function exportAllBoards(
  boards: ObfBoard[],
  onProgress?: (progress: number) => void
): Promise<void> {
  if (boards.length === 0) {
    throw new Error('No boards to export');
  }

  const zip = new JSZip();

  // Add each board as a separate .obf file
  boards.forEach((board, index) => {
    const filename = generateFilename(board);
    const json = JSON.stringify(board, null, 2);
    zip.file(filename, json);

    // Report progress for adding files (0-80% of total)
    if (onProgress) {
      const progress = Math.floor(((index + 1) / boards.length) * 80);
      onProgress(progress);
    }
  });

  // Add manifest.json
  const manifest = createManifest(boards);
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  if (onProgress) {
    onProgress(90);
  }

  // Generate ZIP blob
  const blob = await zip.generateAsync(
    { type: 'blob' },
    (metadata) => {
      // Report progress for ZIP generation (80-100% of total)
      if (onProgress && metadata.percent) {
        const progress = 80 + Math.floor(metadata.percent * 0.2);
        onProgress(progress);
      }
    }
  );

  if (onProgress) {
    onProgress(100);
  }

  // Download with timestamp
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `lovewords-boards-${timestamp}.zip`;

  downloadBlob(blob, filename);
}
