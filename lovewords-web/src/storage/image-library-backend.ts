/**
 * Image Library Storage Backend
 *
 * Centralized storage for image library with deduplication, usage tracking,
 * and efficient localStorage management.
 */

import type {
  ImageLibrary,
  ImageLibraryEntry,
  AddImageOptions,
  AddImageResult,
  ImageLibraryStats,
  RemoveImageResult,
} from '../types/image-library';
import {
  hashDataUrl,
  getImageDimensions,
  getDataUrlSize,
  isValidDataUrl,
  getContentType,
  generateImageName,
  validateImageSize,
} from '../utils/image-hash';

const STORAGE_KEY = 'lovewords-image-library';
const LIBRARY_VERSION = '1.0';

/**
 * Image Library Backend
 *
 * Provides CRUD operations for centralized image storage with:
 * - Automatic deduplication via SHA-256 hashing
 * - Usage count tracking
 * - Storage quota management
 * - Efficient querying and filtering
 */
export class ImageLibraryBackend {
  private storageKey = STORAGE_KEY;

  /**
   * Load image library from localStorage
   * Creates new library if none exists
   */
  async loadLibrary(): Promise<ImageLibrary> {
    try {
      const stored = localStorage.getItem(this.storageKey);

      if (!stored) {
        return this.createEmptyLibrary();
      }

      const library = JSON.parse(stored) as ImageLibrary;

      // Validate structure
      if (!library.version || !Array.isArray(library.images)) {
        console.warn('Invalid library structure, creating new library');
        return this.createEmptyLibrary();
      }

      return library;
    } catch (error) {
      console.error('Failed to load image library:', error);
      return this.createEmptyLibrary();
    }
  }

  /**
   * Save image library to localStorage
   */
  async saveLibrary(library: ImageLibrary): Promise<void> {
    try {
      const serialized = JSON.stringify(library);
      localStorage.setItem(this.storageKey, serialized);
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        throw new Error(
          'Storage quota exceeded. Delete unused images to free up space.'
        );
      }
      throw error;
    }
  }

  /**
   * Add image to library with deduplication
   *
   * If skipDeduplication is false (default), checks for existing image
   * by hash and returns reference to existing image instead of adding duplicate.
   */
  async addImage(
    dataUrl: string,
    options: AddImageOptions = {}
  ): Promise<AddImageResult> {
    try {
      // Validate data URL format
      if (!isValidDataUrl(dataUrl)) {
        return {
          success: false,
          error: 'Invalid image data URL format',
        };
      }

      // Get image metadata
      const contentType = getContentType(dataUrl);
      if (!contentType) {
        return {
          success: false,
          error: 'Could not determine image content type',
        };
      }

      const sizeBytes = getDataUrlSize(dataUrl);
      const sizeValidation = validateImageSize(sizeBytes);
      if (!sizeValidation.valid) {
        return {
          success: false,
          error: sizeValidation.error,
        };
      }

      const dimensions = await getImageDimensions(dataUrl);
      const hash = await hashDataUrl(dataUrl);

      // Check for duplicate (unless skipped)
      if (!options.skipDeduplication) {
        const existing = await this.findByHash(hash);
        if (existing) {
          return {
            success: true,
            imageId: existing.id,
            isDuplicate: true,
            existingId: existing.id,
          };
        }
      }

      // Generate unique ID
      const id = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Generate name if not provided
      const name =
        options.name || generateImageName(contentType || 'image/png');

      // Create new entry
      const entry: ImageLibraryEntry = {
        id,
        name,
        dataUrl,
        contentType,
        sizeBytes,
        width: dimensions.width,
        height: dimensions.height,
        hash,
        createdAt: new Date().toISOString(),
        usageCount: 0,
        tags: options.tags || [],
      };

      // Load library, add entry, save
      const library = await this.loadLibrary();
      library.images.push(entry);
      library.totalSizeBytes += sizeBytes;

      await this.saveLibrary(library);

      return {
        success: true,
        imageId: id,
        isDuplicate: false,
      };
    } catch (error) {
      console.error('Failed to add image:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get image by ID
   */
  async getImage(id: string): Promise<ImageLibraryEntry | null> {
    const library = await this.loadLibrary();
    return library.images.find((img) => img.id === id) || null;
  }

  /**
   * Remove image from library
   * Only allows removal if usageCount is 0
   */
  async removeImage(id: string): Promise<RemoveImageResult> {
    try {
      const library = await this.loadLibrary();
      const index = library.images.findIndex((img) => img.id === id);

      if (index === -1) {
        return {
          success: false,
          error: 'Image not found',
        };
      }

      const image = library.images[index];

      // Check if image is in use
      if (image.usageCount > 0) {
        return {
          success: false,
          inUse: true,
          usageCount: image.usageCount,
          error: `Image is in use by ${image.usageCount} button(s)`,
        };
      }

      // Remove image
      library.images.splice(index, 1);
      library.totalSizeBytes -= image.sizeBytes;

      await this.saveLibrary(library);

      return {
        success: true,
      };
    } catch (error) {
      console.error('Failed to remove image:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Update image metadata
   * Cannot update dataUrl, hash, or sizeBytes (immutable)
   */
  async updateImage(
    id: string,
    updates: Partial<ImageLibraryEntry>
  ): Promise<boolean> {
    try {
      const library = await this.loadLibrary();
      const index = library.images.findIndex((img) => img.id === id);

      if (index === -1) {
        return false;
      }

      // Apply updates (exclude immutable fields)
      const image = library.images[index];
      const { dataUrl, hash, sizeBytes, createdAt, id: _id, ...mutableFields } =
        updates;

      library.images[index] = {
        ...image,
        ...mutableFields,
      };

      await this.saveLibrary(library);
      return true;
    } catch (error) {
      console.error('Failed to update image:', error);
      return false;
    }
  }

  /**
   * Find image by content hash
   * Used for deduplication
   */
  async findByHash(hash: string): Promise<ImageLibraryEntry | null> {
    const library = await this.loadLibrary();
    return library.images.find((img) => img.hash === hash) || null;
  }

  /**
   * Increment usage count
   * Called when a button starts using this image
   */
  async incrementUsage(id: string): Promise<void> {
    const library = await this.loadLibrary();
    const image = library.images.find((img) => img.id === id);

    if (!image) {
      throw new Error(`Image not found: ${id}`);
    }

    image.usageCount += 1;
    image.lastUsedAt = new Date().toISOString();

    await this.saveLibrary(library);
  }

  /**
   * Decrement usage count
   * Called when a button stops using this image
   */
  async decrementUsage(id: string): Promise<void> {
    const library = await this.loadLibrary();
    const image = library.images.find((img) => img.id === id);

    if (!image) {
      throw new Error(`Image not found: ${id}`);
    }

    image.usageCount = Math.max(0, image.usageCount - 1);

    await this.saveLibrary(library);
  }

  /**
   * Get library statistics
   */
  async getStats(): Promise<ImageLibraryStats> {
    const library = await this.loadLibrary();

    const totalImages = library.images.length;
    const totalSizeBytes = library.totalSizeBytes;
    const averageSizeBytes =
      totalImages > 0 ? totalSizeBytes / totalImages : 0;
    const totalUsages = library.images.reduce(
      (sum, img) => sum + img.usageCount,
      0
    );
    const unusedImages = library.images.filter(
      (img) => img.usageCount === 0
    ).length;

    return {
      totalImages,
      totalSizeBytes,
      averageSizeBytes,
      totalUsages,
      unusedImages,
    };
  }

  /**
   * Clear entire library
   * USE WITH CAUTION - removes all images
   */
  async clearLibrary(): Promise<void> {
    const library = this.createEmptyLibrary();
    await this.saveLibrary(library);
  }

  /**
   * Get all images (for UI display)
   * Returns shallow copy to prevent accidental mutations
   */
  async getAllImages(): Promise<ImageLibraryEntry[]> {
    const library = await this.loadLibrary();
    return library.images.map((img) => ({ ...img }));
  }

  /**
   * Search images by name or tags
   */
  async searchImages(query: string): Promise<ImageLibraryEntry[]> {
    const library = await this.loadLibrary();
    const lowerQuery = query.toLowerCase();

    return library.images.filter(
      (img) =>
        img.name.toLowerCase().includes(lowerQuery) ||
        img.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get unused images (usageCount === 0)
   */
  async getUnusedImages(): Promise<ImageLibraryEntry[]> {
    const library = await this.loadLibrary();
    return library.images.filter((img) => img.usageCount === 0);
  }

  /**
   * Create empty library structure
   */
  private createEmptyLibrary(): ImageLibrary {
    return {
      version: LIBRARY_VERSION,
      images: [],
      totalSizeBytes: 0,
    };
  }
}

/**
 * Singleton instance for convenience
 */
export const imageLibrary = new ImageLibraryBackend();
