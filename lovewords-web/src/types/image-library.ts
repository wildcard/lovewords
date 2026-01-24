/**
 * Image Library Types
 *
 * Type definitions for centralized image storage and management.
 */

export interface ImageLibraryEntry {
  /** Unique identifier for this image */
  id: string;
  /** User-defined name for the image */
  name: string;
  /** Base64 data URI of the image */
  dataUrl: string;
  /** MIME type (e.g., image/png, image/jpeg) */
  contentType: string;
  /** Size in bytes */
  sizeBytes: number;
  /** Image width in pixels */
  width?: number;
  /** Image height in pixels */
  height?: number;
  /** SHA-256 hash for deduplication */
  hash: string;
  /** When the image was added to library */
  createdAt: string;
  /** Last time this image was used in a button */
  lastUsedAt?: string;
  /** Number of buttons currently using this image */
  usageCount: number;
  /** Optional tags for categorization */
  tags?: string[];
}

export interface ImageLibrary {
  /** Schema version for migrations */
  version: string;
  /** All images in the library */
  images: ImageLibraryEntry[];
  /** Total size of all images in bytes */
  totalSizeBytes: number;
}

export interface AddImageOptions {
  /** Custom name for the image (auto-generated if not provided) */
  name?: string;
  /** Tags for categorization */
  tags?: string[];
  /** Skip deduplication check (force add) */
  skipDeduplication?: boolean;
}

export interface AddImageResult {
  /** Whether the operation succeeded */
  success: boolean;
  /** ID of the added or existing image */
  imageId?: string;
  /** Whether this image already exists (duplicate) */
  isDuplicate?: boolean;
  /** ID of existing image if duplicate */
  existingId?: string;
  /** Error message if failed */
  error?: string;
}

export interface ImageLibraryStats {
  /** Total number of images */
  totalImages: number;
  /** Total size in bytes */
  totalSizeBytes: number;
  /** Average size per image */
  averageSizeBytes: number;
  /** Total usage count across all images */
  totalUsages: number;
  /** Number of unused images */
  unusedImages: number;
}

export interface RemoveImageResult {
  /** Whether the removal succeeded */
  success: boolean;
  /** Whether image was in use (couldn't remove) */
  inUse?: boolean;
  /** Current usage count if in use */
  usageCount?: number;
  /** Error message if failed */
  error?: string;
}
