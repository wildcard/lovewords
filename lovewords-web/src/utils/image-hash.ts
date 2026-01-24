/**
 * Image Hash Utilities
 *
 * Functions for hashing, validating, and analyzing image data URIs.
 */

/**
 * Generate SHA-256 hash of data URI for deduplication
 * Hashes only the base64 content, not the MIME type prefix
 */
export async function hashDataUrl(dataUrl: string): Promise<string> {
  // Extract base64 content (remove data:image/...;base64, prefix)
  const base64Content = dataUrl.split(',')[1];

  if (!base64Content) {
    throw new Error('Invalid data URL format');
  }

  // Convert base64 to binary
  const binaryString = atob(base64Content);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Hash using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

/**
 * Get image dimensions from data URI
 */
export async function getImageDimensions(
  dataUrl: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = dataUrl;
  });
}

/**
 * Get size in bytes of data URI
 * Approximates the actual data size (not including base64 encoding overhead)
 */
export function getDataUrlSize(dataUrl: string): number {
  // Extract base64 content
  const base64Content = dataUrl.split(',')[1];

  if (!base64Content) {
    return 0;
  }

  // Calculate actual data size (base64 encoding adds ~33% overhead)
  // Each base64 character represents 6 bits
  // Padding characters (=) don't contribute to size
  const paddingChars = (base64Content.match(/=/g) || []).length;
  const actualBytes = (base64Content.length * 6) / 8 - paddingChars;

  return Math.floor(actualBytes);
}

/**
 * Validate data URI format
 */
export function isValidDataUrl(dataUrl: string): boolean {
  // Check basic format: data:<mediatype>;base64,<data>
  const dataUrlPattern = /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,/;
  return dataUrlPattern.test(dataUrl);
}

/**
 * Extract content type from data URI
 */
export function getContentType(dataUrl: string): string | null {
  const match = dataUrl.match(/^data:(image\/[^;]+);base64,/);
  return match ? match[1] : null;
}

/**
 * Generate a short name from content type and timestamp
 */
export function generateImageName(contentType: string): string {
  const timestamp = Date.now();
  const extension = contentType.split('/')[1] || 'image';
  return `image-${timestamp}.${extension}`;
}

/**
 * Format bytes as human-readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Validate image size (max 5 MB per image)
 */
export function validateImageSize(sizeBytes: number): {
  valid: boolean;
  error?: string;
} {
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

  if (sizeBytes > MAX_SIZE) {
    return {
      valid: false,
      error: `Image too large (${formatBytes(sizeBytes)}). Maximum size is ${formatBytes(MAX_SIZE)}.`,
    };
  }

  return { valid: true };
}
