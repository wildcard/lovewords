/**
 * ImageUploader component - handles image upload and optimization
 */

import { useState, useRef } from 'react';

export interface ImageUploaderProps {
  /** Current image URL (data URL or external URL) */
  currentImage?: string;
  /** Callback when image is uploaded and optimized */
  onImageUploaded: (dataUrl: string) => void;
  /** Callback to remove image */
  onImageRemoved?: () => void;
}

/**
 * Detect if the user is on a mobile device
 */
function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Optimize an image to meet size constraints
 * - Resize to max 200×200px
 * - Compress to JPEG 80% quality
 * - Target <100KB
 */
async function optimizeImage(
  file: File,
  options: {
    maxWidth: number;
    maxHeight: number;
    quality: number;
  }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read file'));

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();

      img.onerror = () => reject(new Error('Failed to load image'));

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Calculate dimensions maintaining aspect ratio
        let { width, height } = img;
        if (width > options.maxWidth || height > options.maxHeight) {
          const ratio = Math.min(
            options.maxWidth / width,
            options.maxHeight / height
          );
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const optimized = canvas.toDataURL('image/jpeg', options.quality);

        resolve(optimized);
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}

export function ImageUploader({
  currentImage,
  onImageUploaded,
  onImageRemoved,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile] = useState(isMobileDevice());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 10MB before optimization)
    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image is too large (max ${maxSizeMB}MB)`);
      return;
    }

    setError(null);
    setIsOptimizing(true);

    try {
      // Optimize the image
      const optimized = await optimizeImage(file, {
        maxWidth: 200,
        maxHeight: 200,
        quality: 0.8,
      });

      // Check optimized size
      const sizeKB = Math.round((optimized.length * 3) / 4 / 1024); // Base64 size estimate
      if (sizeKB > 100) {
        console.warn(`Optimized image is ${sizeKB}KB (target: <100KB)`);
        // Still proceed, but could show warning to user
      }

      setPreview(optimized);
      onImageUploaded(optimized);
    } catch (err) {
      console.error('Failed to optimize image:', err);
      setError('Failed to process image. Please try another file.');
    } finally {
      setIsOptimizing(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setError(null);
    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleTakePhoto = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <label className="block font-medium">Button Image</label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload image file"
      />

      {/* Hidden camera input (mobile only) */}
      {isMobile && (
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Take photo with camera"
        />
      )}

      {/* Preview or upload button */}
      {preview ? (
        <div className="space-y-2">
          <div className="flex justify-center p-4 bg-gray-50 rounded-md border border-gray-300">
            <img
              src={preview}
              alt="Button preview"
              className="max-w-[200px] max-h-[200px] object-contain"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleUploadClick}
              className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
            >
              Replace Image
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
            >
              Remove Image
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Take Photo button (mobile only) */}
          {isMobile && (
            <button
              type="button"
              onClick={handleTakePhoto}
              disabled={isOptimizing}
              className="w-full px-4 py-3 bg-purple-50 text-purple-700 rounded-md border-2 border-dashed border-purple-300 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOptimizing ? 'Processing...' : '📸 Take Photo'}
            </button>
          )}

          {/* Upload from device */}
          <button
            type="button"
            onClick={handleUploadClick}
            disabled={isOptimizing}
            className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-md border-2 border-dashed border-blue-300 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isOptimizing ? 'Optimizing...' : '📷 Upload Image'}
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      {/* Help text */}
      <p className="text-gray-500 text-xs">
        {isMobile ? (
          <>
            Take a photo with your camera or upload from your device
            <br />
            Images will be resized to 200×200px and optimized
          </>
        ) : (
          <>
            Supported: JPG, PNG, GIF, WebP (max 10MB)
            <br />
            Images will be resized to 200×200px and optimized
          </>
        )}
      </p>
    </div>
  );
}
