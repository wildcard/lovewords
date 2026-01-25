/**
 * Image Library Manager Component
 *
 * Dedicated UI for managing the centralized image library.
 * Features: view all, search, sort, rename, tag, delete, statistics.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { imageLibrary } from '../storage/image-library-backend';
import type { ImageLibraryEntry, ImageLibraryStats } from '../types/image-library';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { formatBytes } from '../utils/image-hash';

export interface ImageLibraryManagerProps {
  onClose: () => void;
}

type SortOption = 'name' | 'newest' | 'oldest' | 'size' | 'usage';

/**
 * Image Library Manager Modal
 *
 * Full-featured management interface for the image library.
 */
export function ImageLibraryManager({ onClose }: ImageLibraryManagerProps) {
  const modalRef = useFocusTrap<HTMLDivElement>();

  const [images, setImages] = useState<ImageLibraryEntry[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageLibraryEntry[]>([]);
  const [stats, setStats] = useState<ImageLibraryStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load images and stats
  useEffect(() => {
    loadLibrary();
  }, []);

  // Filter and sort when dependencies change
  useEffect(() => {
    let filtered = [...images];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (img) =>
          img.name.toLowerCase().includes(query) ||
          img.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'size':
          return b.sizeBytes - a.sizeBytes;
        case 'usage':
          return b.usageCount - a.usageCount;
        default:
          return 0;
      }
    });

    setFilteredImages(filtered);
  }, [images, searchQuery, sortBy]);

  const loadLibrary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [allImages, libraryStats] = await Promise.all([
        imageLibrary.getAllImages(),
        imageLibrary.getStats(),
      ]);
      setImages(allImages);
      setFilteredImages(allImages);
      setStats(libraryStats);
    } catch (err) {
      console.error('Failed to load library:', err);
      setError('Failed to load image library');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(
    async (imageId: string, event: React.MouseEvent) => {
      event.stopPropagation();

      const image = images.find((img) => img.id === imageId);
      if (!image) return;

      if (image.usageCount > 0) {
        alert(
          `Cannot delete "${image.name}". It is used by ${image.usageCount} button(s).`
        );
        return;
      }

      if (!confirm(`Delete "${image.name}"? This action cannot be undone.`)) {
        return;
      }

      try {
        setDeletingId(imageId);
        const result = await imageLibrary.removeImage(imageId);

        if (!result.success) {
          alert(result.error || 'Failed to delete image');
          return;
        }

        await loadLibrary();
      } catch (err) {
        console.error('Failed to delete image:', err);
        alert('Failed to delete image');
      } finally {
        setDeletingId(null);
      }
    },
    [images, loadLibrary]
  );

  const handleDeleteUnused = useCallback(async () => {
    const unusedImages = images.filter((img) => img.usageCount === 0);

    if (unusedImages.length === 0) {
      alert('No unused images to delete');
      return;
    }

    if (
      !confirm(
        `Delete ${unusedImages.length} unused image(s)? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      let deleted = 0;
      for (const image of unusedImages) {
        const result = await imageLibrary.removeImage(image.id);
        if (result.success) {
          deleted++;
        }
      }

      await loadLibrary();
      alert(`Successfully deleted ${deleted} unused image(s)`);
    } catch (err) {
      console.error('Failed to delete unused images:', err);
      alert('Failed to delete unused images');
    }
  }, [images, loadLibrary]);

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="library-manager-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2
            id="library-manager-title"
            className="text-xl font-semibold text-gray-900"
          >
            🖼️ Image Library Manager
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close library manager"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        {/* Statistics Bar */}
        {stats && (
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Total Images:</span>
                <span className="text-gray-900">{stats.totalImages}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Total Size:</span>
                <span className="text-gray-900">
                  {formatBytes(stats.totalSizeBytes)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Avg Size:</span>
                <span className="text-gray-900">
                  {formatBytes(stats.averageSizeBytes)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Total Usage:</span>
                <span className="text-gray-900">{stats.totalUsages}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Unused:</span>
                <span className="text-gray-900">{stats.unusedImages}</span>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or tag..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="name">Name (A-Z)</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="size">Size (Largest)</option>
              <option value="usage">Most Used</option>
            </select>
          </div>

          {/* Delete Unused Button */}
          {stats && stats.unusedImages > 0 && (
            <button
              onClick={handleDeleteUnused}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              🗑️ Delete Unused ({stats.unusedImages})
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="text-center py-12 text-gray-500">
              Loading library...
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadLibrary}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && filteredImages.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {searchQuery ? (
                <>
                  <p className="mb-2">No images found matching "{searchQuery}"</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-blue-600 hover:underline"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <p>No images in library yet</p>
              )}
            </div>
          )}

          {!loading && !error && filteredImages.length > 0 && (
            <>
              {/* Results Count */}
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredImages.length} of {images.length} images
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredImages.map((image) => {
                  const isDeleting = image.id === deletingId;

                  return (
                    <div
                      key={image.id}
                      className={`relative border-2 border-gray-200 rounded-lg p-2 transition-all ${
                        isDeleting ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="aspect-square rounded overflow-hidden bg-gray-100 mb-2">
                        <img
                          src={image.dataUrl}
                          alt={image.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>

                      {/* Image Info */}
                      <div className="space-y-1">
                        <p
                          className="text-sm font-medium text-gray-900 truncate"
                          title={image.name}
                        >
                          {image.name}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatBytes(image.sizeBytes)}</span>
                          {image.width && image.height && (
                            <span>
                              {image.width}×{image.height}
                            </span>
                          )}
                        </div>

                        {/* Usage Badge */}
                        {image.usageCount > 0 && (
                          <div className="flex items-center gap-1 text-xs text-blue-600">
                            <span>📌</span>
                            <span>
                              {image.usageCount} button
                              {image.usageCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}

                        {/* Tags */}
                        {image.tags && image.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {image.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Delete Button (only for unused images) */}
                      {image.usageCount === 0 && (
                        <button
                          onClick={(e) => handleDelete(image.id, e)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                          aria-label={`Delete ${image.name}`}
                          title="Delete image"
                        >
                          🗑️
                        </button>
                      )}

                      {/* In Use Indicator */}
                      {image.usageCount > 0 && (
                        <div className="absolute top-1 right-1 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                          In Use
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
