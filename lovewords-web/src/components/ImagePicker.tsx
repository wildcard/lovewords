/**
 * Image Picker Component
 *
 * Modal for browsing and selecting images from the centralized image library.
 * Features: search, grid display, usage indicators, delete unused images.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { imageLibrary } from '../storage/image-library-backend';
import type { ImageLibraryEntry } from '../types/image-library';
import { useFocusTrap } from '../hooks/useFocusTrap';
import {
  formatBytes,
  getImageDimensions,
  getDataUrlSize,
  validateImageSize,
  isValidDataUrl,
  hashDataUrl,
} from '../utils/image-hash';

export interface ImagePickerProps {
  onSelect: (imageId: string) => void;
  onClose: () => void;
  currentImageId?: string;
  allowUpload?: boolean;
  allowDelete?: boolean;
}

interface ImagePreview {
  dataUrl: string;
  name: string;
  size: number;
  width?: number;
  height?: number;
  isDuplicate: boolean;
  existingId?: string;
}

/**
 * Image Picker Modal
 *
 * Displays images from the library in a responsive grid.
 * Users can search, preview, select, and delete (unused) images.
 */
export function ImagePicker({
  onSelect,
  onClose,
  currentImageId,
  allowUpload = true,
  allowDelete = true,
}: ImagePickerProps) {
  const modalRef = useFocusTrap<HTMLDivElement>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Browse mode state
  const [mode, setMode] = useState<'browse' | 'upload'>('browse');
  const [images, setImages] = useState<ImageLibraryEntry[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageLibraryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Upload mode state
  const [preview, setPreview] = useState<ImagePreview | null>(null);
  const [customName, setCustomName] = useState('');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Load images on mount
  useEffect(() => {
    loadImages();
  }, []);

  // Filter images when search changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredImages(images);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = images.filter(
      (img) =>
        img.name.toLowerCase().includes(query) ||
        img.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
    setFilteredImages(filtered);
  }, [searchQuery, images]);

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allImages = await imageLibrary.getAllImages();
      setImages(allImages);
      setFilteredImages(allImages);
    } catch (err) {
      console.error('Failed to load images:', err);
      setError('Failed to load image library');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelect = useCallback(
    (imageId: string) => {
      onSelect(imageId);
      onClose();
    },
    [onSelect, onClose]
  );

  const handleDelete = useCallback(
    async (imageId: string, event: React.MouseEvent) => {
      event.stopPropagation(); // Prevent triggering select

      const image = images.find((img) => img.id === imageId);
      if (!image) return;

      if (image.usageCount > 0) {
        alert(
          `Cannot delete image "${image.name}". It is used by ${image.usageCount} button(s).`
        );
        return;
      }

      if (
        !confirm(`Delete image "${image.name}"? This action cannot be undone.`)
      ) {
        return;
      }

      try {
        setDeletingId(imageId);
        const result = await imageLibrary.removeImage(imageId);

        if (!result.success) {
          alert(result.error || 'Failed to delete image');
          return;
        }

        // Reload images
        await loadImages();
      } catch (err) {
        console.error('Failed to delete image:', err);
        alert('Failed to delete image');
      } finally {
        setDeletingId(null);
      }
    },
    [images, loadImages]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Upload handlers
  const handleOpenUpload = useCallback(() => {
    setMode('upload');
    setError(null);
  }, []);

  const handleCancelUpload = useCallback(() => {
    setMode('browse');
    setPreview(null);
    setCustomName('');
    setTags('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const dataUrl = e.target?.result as string;

        if (!isValidDataUrl(dataUrl)) {
          setError('Invalid image format');
          return;
        }

        const size = getDataUrlSize(dataUrl);
        const sizeValidation = validateImageSize(size);
        if (!sizeValidation.valid) {
          setError(sizeValidation.error || 'Image too large');
          return;
        }

        const dimensions = await getImageDimensions(dataUrl);
        const hash = await hashDataUrl(dataUrl);
        const existing = await imageLibrary.findByHash(hash);

        setPreview({
          dataUrl,
          name: file.name.replace(/\.[^/.]+$/, ''),
          size,
          width: dimensions.width,
          height: dimensions.height,
          isDuplicate: !!existing,
          existingId: existing?.id,
        });
      } catch (err) {
        console.error('Failed to process image:', err);
        setError('Failed to process image');
      }
    };

    reader.onerror = () => {
      setError('Failed to read file');
    };

    reader.readAsDataURL(file);
  }, []);

  const handleFileInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setDragActive(false);

      const file = event.dataTransfer.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleUpload = useCallback(async () => {
    if (!preview) return;

    try {
      setUploading(true);
      setError(null);

      if (preview.isDuplicate && preview.existingId) {
        onSelect(preview.existingId);
        onClose();
        return;
      }

      const result = await imageLibrary.addImage(preview.dataUrl, {
        name: customName.trim() || preview.name,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
      });

      if (!result.success) {
        setError(result.error || 'Failed to add image');
        return;
      }

      if (result.imageId) {
        // Reload images and select the new one
        await loadImages();
        onSelect(result.imageId);
        onClose();
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  }, [preview, customName, tags, onSelect, onClose, loadImages]);

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

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
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="image-picker-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2
            id="image-picker-title"
            className="text-xl font-semibold text-gray-900"
          >
            {mode === 'browse' ? '🖼️ Choose an Image' : '📤 Upload Image'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close image picker"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        {/* File Input (hidden) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        {mode === 'browse' ? (
          <>
            {/* Search and Upload Bar */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200">
              {/* Search */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search images by name or tag..."
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Upload Button */}
              {allowUpload && (
                <button
                  onClick={handleOpenUpload}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  📤 Upload
                </button>
              )}
            </div>
          </>
        ) : null}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {mode === 'browse' && loading && (
            <div className="text-center py-12 text-gray-500">
              Loading images...
            </div>
          )}

          {mode === 'browse' && error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadImages}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          )}

          {mode === 'browse' && !loading && !error && filteredImages.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {searchQuery ? (
                <>
                  <p className="mb-2">No images found matching "{searchQuery}"</p>
                  <button
                    onClick={handleClearSearch}
                    className="text-blue-600 hover:underline"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <p className="mb-4">No images in library yet</p>
                  {allowUpload && (
                    <button
                      onClick={handleOpenUpload}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      📤 Upload your first image
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {mode === 'browse' && !loading && !error && filteredImages.length > 0 && (
            <>
              {/* Image Count */}
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredImages.length} of {images.length} images
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredImages.map((image) => {
                  const isSelected = image.id === currentImageId;
                  const isDeleting = image.id === deletingId;

                  return (
                    <div
                      key={image.id}
                      className={`relative border-2 rounded-lg p-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      } ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={() => handleSelect(image.id)}
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
                              Used by {image.usageCount} button
                              {image.usageCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Delete Button (only for unused images) */}
                      {allowDelete && image.usageCount === 0 && (
                        <button
                          onClick={(e) => handleDelete(image.id, e)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                          aria-label={`Delete ${image.name}`}
                          title="Delete image"
                        >
                          🗑️
                        </button>
                      )}

                      {/* Selected Indicator */}
                      {isSelected && (
                        <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          ✓ Current
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Upload Mode UI */}
          {mode === 'upload' && (
            <div className="space-y-4">
              {!preview ? (
                <>
                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                      dragActive
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="text-6xl">🖼️</div>
                      <div>
                        <p className="text-lg font-medium text-gray-900 mb-1">
                          Drag and drop an image here
                        </p>
                        <p className="text-sm text-gray-500">
                          or click below to browse
                        </p>
                      </div>
                      <button
                        onClick={handleBrowseClick}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                      >
                        Browse Files
                      </button>
                      <p className="text-xs text-gray-400">
                        Supported: PNG, JPEG, GIF, WebP, SVG • Max size: 5MB
                      </p>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Cancel Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleCancelUpload}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      ← Back to Library
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Image Preview */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-32 h-32 rounded border border-gray-200 bg-white overflow-hidden">
                        <img
                          src={preview.dataUrl}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Size:</span>{' '}
                          <span className="text-gray-900">
                            {formatBytes(preview.size)}
                          </span>
                        </div>
                        {preview.width && preview.height && (
                          <div>
                            <span className="font-medium text-gray-700">
                              Dimensions:
                            </span>{' '}
                            <span className="text-gray-900">
                              {preview.width} × {preview.height} px
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Duplicate Warning */}
                  {preview.isDuplicate && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex gap-2">
                        <span className="text-xl">⚠️</span>
                        <div className="flex-1">
                          <p className="font-medium text-yellow-900 mb-1">
                            Duplicate Image Detected
                          </p>
                          <p className="text-sm text-yellow-700">
                            This image already exists in your library. It will be selected
                            instead of creating a duplicate.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="image-name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Image Name
                    </label>
                    <input
                      id="image-name"
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder={preview.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={preview.isDuplicate}
                    />
                    {preview.isDuplicate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Name cannot be changed for existing images
                      </p>
                    )}
                  </div>

                  {/* Tags Input */}
                  {!preview.isDuplicate && (
                    <div>
                      <label
                        htmlFor="image-tags"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Tags (optional)
                      </label>
                      <input
                        id="image-tags"
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="emotion, happy, yellow"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separate tags with commas
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleCancelUpload}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      disabled={uploading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading
                        ? 'Adding...'
                        : preview.isDuplicate
                        ? 'Use Existing'
                        : 'Add to Library'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
