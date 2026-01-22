/**
 * Board sharing utilities - encode boards as shareable links and QR codes
 */

import LZString from 'lz-string';
import QRCode from 'qrcode';
import type { ObfBoard } from '../types/obf';

/**
 * Maximum URL length for compatibility
 */
const MAX_URL_LENGTH = 2000;

/**
 * Generate a shareable link for a board
 *
 * Compresses and encodes board data in the URL hash
 * Format: https://lovewords.app/#/import?board=<compressed-data>
 *
 * @param board - The board to share
 * @param baseUrl - Base URL (defaults to current origin)
 * @returns Shareable URL
 * @throws Error if board is too large for URL
 */
export function generateShareableLink(
  board: ObfBoard,
  baseUrl: string = window.location.origin
): string {
  // Serialize board to JSON
  const json = JSON.stringify(board);

  // Compress using LZ-String
  const compressed = LZString.compressToEncodedURIComponent(json);

  // Build URL
  const url = `${baseUrl}/#/import?board=${compressed}`;

  // Check length
  if (url.length > MAX_URL_LENGTH) {
    throw new Error(
      `Board is too large to share via link (${url.length} chars). Consider using export instead.`
    );
  }

  return url;
}

/**
 * Parse a board from a shareable link
 *
 * Decodes and decompresses board data from URL parameter
 *
 * @param url - The shareable URL or just the compressed data
 * @returns Parsed board
 * @throws Error if URL is invalid or board data is corrupted
 */
export function parseBoardFromLink(url: string): ObfBoard {
  try {
    // Extract compressed data from URL
    let compressed: string;

    if (url.startsWith('http')) {
      // Full URL - extract from hash
      const hashPart = url.split('#')[1];
      if (!hashPart) {
        throw new Error('Invalid share link: No hash fragment');
      }

      const params = new URLSearchParams(hashPart.split('?')[1]);
      compressed = params.get('board') || '';

      if (!compressed) {
        throw new Error('Invalid share link: Missing board parameter');
      }
    } else {
      // Just the compressed data
      compressed = url;
    }

    // Decompress
    const json = LZString.decompressFromEncodedURIComponent(compressed);

    if (!json) {
      throw new Error('Failed to decompress board data');
    }

    // Parse JSON
    const board = JSON.parse(json) as ObfBoard;

    return board;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to parse board from link: ${err.message}`);
    }
    throw new Error('Failed to parse board from link');
  }
}

/**
 * Generate a QR code for a shareable link
 *
 * @param shareableUrl - The shareable URL
 * @param options - QR code options
 * @returns Data URL of QR code PNG image
 */
export async function generateQRCode(
  shareableUrl: string,
  options?: {
    width?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }
): Promise<string> {
  const qrOptions = {
    width: options?.width || 256,
    margin: 2,
    color: {
      dark: options?.color?.dark || '#000000',
      light: options?.color?.light || '#FFFFFF',
    },
  };

  return await QRCode.toDataURL(shareableUrl, qrOptions);
}

/**
 * Copy text to clipboard
 *
 * @param text - Text to copy
 * @returns Promise that resolves when copied
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

/**
 * Download a data URL as a file
 *
 * @param dataUrl - Data URL (e.g., from canvas.toDataURL())
 * @param filename - Filename for download
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = filename;
  anchor.style.display = 'none';

  document.body.appendChild(anchor);
  anchor.click();

  setTimeout(() => {
    document.body.removeChild(anchor);
  }, 100);
}

/**
 * Get the compression ratio (how much smaller the compressed data is)
 *
 * @param board - The board to analyze
 * @returns Compression ratio (0-1, lower is better compression)
 */
export function getCompressionRatio(board: ObfBoard): number {
  const json = JSON.stringify(board);
  const compressed = LZString.compressToEncodedURIComponent(json);
  return compressed.length / json.length;
}
