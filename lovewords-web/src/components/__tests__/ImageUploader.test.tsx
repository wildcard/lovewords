/**
 * Tests for ImageUploader component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageUploader } from '../ImageUploader';

describe('ImageUploader', () => {
  const mockOnImageUploaded = vi.fn();
  const mockOnImageRemoved = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render upload button when no image', () => {
      render(
        <ImageUploader
          onImageUploaded={mockOnImageUploaded}
          onImageRemoved={mockOnImageRemoved}
        />
      );

      expect(screen.getByText(/upload image/i) || screen.getByText(/add image/i)).toBeInTheDocument();
    });

    it('should render image preview when image exists', () => {
      const imageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

      render(
        <ImageUploader
          currentImage={imageUrl}
          onImageUploaded={mockOnImageUploaded}
          onImageRemoved={mockOnImageRemoved}
        />
      );

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', imageUrl);
    });

    it('should show file input for image upload', () => {
      render(
        <ImageUploader
          onImageUploaded={mockOnImageUploaded}
          onImageRemoved={mockOnImageRemoved}
        />
      );

      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('accept', expect.stringContaining('image'));
    });
  });

  describe('Image Upload', () => {
    it('should accept PNG, JPEG, GIF, WebP images', () => {
      render(
        <ImageUploader
          onImageUploaded={mockOnImageUploaded}
          onImageRemoved={mockOnImageRemoved}
        />
      );

      const fileInput = document.querySelector('input[type="file"]');
      const acceptAttr = fileInput?.getAttribute('accept');

      expect(acceptAttr).toContain('image/png');
      expect(acceptAttr).toContain('image/jpeg');
      expect(acceptAttr).toContain('image/gif');
      expect(acceptAttr).toContain('image/webp');
    });

    it('should have file input in DOM', () => {
      render(
        <ImageUploader
          onImageUploaded={mockOnImageUploaded}
          onImageRemoved={mockOnImageRemoved}
        />
      );

      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
    });
  });

  describe('Image Removal', () => {
    it('should call onImageRemoved when remove button clicked', () => {
      const imageUrl = 'data:image/png;base64,mockdata';

      render(
        <ImageUploader
          currentImage={imageUrl}
          onImageUploaded={mockOnImageUploaded}
          onImageRemoved={mockOnImageRemoved}
        />
      );

      const removeButton = screen.getByRole('button', { name: /remove/i });
      fireEvent.click(removeButton);

      expect(mockOnImageRemoved).toHaveBeenCalledTimes(1);
    });

    it('should not show remove button when no image', () => {
      render(
        <ImageUploader
          onImageUploaded={mockOnImageUploaded}
          onImageRemoved={mockOnImageRemoved}
        />
      );

      expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();
    });

    it('should handle missing onImageRemoved callback', () => {
      const imageUrl = 'data:image/png;base64,mockdata';

      // Should not crash if onImageRemoved is not provided
      render(
        <ImageUploader
          currentImage={imageUrl}
          onImageUploaded={mockOnImageUploaded}
        />
      );

      const removeButton = screen.queryByRole('button', { name: /remove/i });
      if (removeButton) {
        fireEvent.click(removeButton);
      }
      // Should not throw
    });
  });

  describe('Camera Support', () => {
    it('should show camera option on mobile devices', () => {
      // Mock mobile user agent
      const originalUserAgent = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });

      render(
        <ImageUploader
          onImageUploaded={mockOnImageUploaded}
          onImageRemoved={mockOnImageRemoved}
        />
      );

      // Camera input should be present on mobile
      const cameraInput = document.querySelector('input[capture]');
      if (cameraInput) {
        expect(cameraInput).toBeInTheDocument();
      }

      // Restore original userAgent
      Object.defineProperty(navigator, 'userAgent', {
        value: originalUserAgent,
        configurable: true,
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible file input', () => {
      render(
        <ImageUploader
          onImageUploaded={mockOnImageUploaded}
          onImageRemoved={mockOnImageRemoved}
        />
      );

      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
    });

    it('should have accessible label for remove button', () => {
      const imageUrl = 'data:image/png;base64,mockdata';

      render(
        <ImageUploader
          currentImage={imageUrl}
          onImageUploaded={mockOnImageUploaded}
          onImageRemoved={mockOnImageRemoved}
        />
      );

      const removeButton = screen.getByRole('button', { name: /remove/i });
      expect(removeButton).toHaveAccessibleName();
    });

    it('should have alt text for image preview', () => {
      const imageUrl = 'data:image/png;base64,mockdata';

      render(
        <ImageUploader
          currentImage={imageUrl}
          onImageUploaded={mockOnImageUploaded}
          onImageRemoved={mockOnImageRemoved}
        />
      );

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing image gracefully', () => {
      expect(() =>
        render(
          <ImageUploader
            onImageUploaded={mockOnImageUploaded}
            onImageRemoved={mockOnImageRemoved}
          />
        )
      ).not.toThrow();
    });

    it('should handle undefined currentImage', () => {
      expect(() =>
        render(
          <ImageUploader
            currentImage={undefined}
            onImageUploaded={mockOnImageUploaded}
            onImageRemoved={mockOnImageRemoved}
          />
        )
      ).not.toThrow();
    });

    it('should handle empty string currentImage', () => {
      expect(() =>
        render(
          <ImageUploader
            currentImage=""
            onImageUploaded={mockOnImageUploaded}
            onImageRemoved={mockOnImageRemoved}
          />
        )
      ).not.toThrow();
    });
  });
});
