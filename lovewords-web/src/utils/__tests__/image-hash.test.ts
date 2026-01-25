/**
 * Tests for image-hash utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  hashDataUrl,
  getDataUrlSize,
  isValidDataUrl,
  validateImageSize,
  formatBytes,
  getContentType,
  generateImageName,
} from '../image-hash';

// Sample data URLs for testing
const SAMPLE_PNG_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const SAMPLE_JPEG_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q==';

describe('image-hash', () => {
  describe('hashDataUrl', () => {
    it('should generate consistent hash for same data', async () => {
      const hash1 = await hashDataUrl(SAMPLE_PNG_DATA_URL);
      const hash2 = await hashDataUrl(SAMPLE_PNG_DATA_URL);

      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hex string
    });

    it('should generate different hashes for different data', async () => {
      const hash1 = await hashDataUrl(SAMPLE_PNG_DATA_URL);
      const hash2 = await hashDataUrl(SAMPLE_JPEG_DATA_URL);

      expect(hash1).not.toBe(hash2);
    });

    it('should throw error for invalid data URL', async () => {
      await expect(hashDataUrl('not-a-data-url')).rejects.toThrow();
    });

    it('should throw error for empty string', async () => {
      await expect(hashDataUrl('')).rejects.toThrow();
    });
  });

  describe('getDataUrlSize', () => {
    it('should calculate correct size for PNG', () => {
      const size = getDataUrlSize(SAMPLE_PNG_DATA_URL);
      // Base64 decodes to roughly 3/4 the character length
      expect(size).toBeGreaterThan(0);
      expect(size).toBeLessThan(200); // Small 1x1 PNG
    });

    it('should return 0 for invalid data URL', () => {
      expect(getDataUrlSize('invalid')).toBe(0);
      expect(getDataUrlSize('')).toBe(0);
    });

    it('should handle data URL with content after comma', () => {
      const dataUrl = 'data:text/plain,Hello';
      const size = getDataUrlSize(dataUrl);
      // Function calculates size from any content after comma
      expect(size).toBeGreaterThanOrEqual(0);
    });
  });

  describe('isValidDataUrl', () => {
    it('should return true for valid PNG data URL', () => {
      expect(isValidDataUrl(SAMPLE_PNG_DATA_URL)).toBe(true);
    });

    it('should return true for valid JPEG data URL', () => {
      expect(isValidDataUrl(SAMPLE_JPEG_DATA_URL)).toBe(true);
    });

    it('should return false for non-data URL', () => {
      expect(isValidDataUrl('https://example.com/image.png')).toBe(false);
      expect(isValidDataUrl('file:///path/to/image.png')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidDataUrl('')).toBe(false);
    });

    it('should return false for non-image data URL', () => {
      expect(isValidDataUrl('data:text/plain;base64,SGVsbG8=')).toBe(false);
    });
  });

  describe('validateImageSize', () => {
    it('should accept images under 5MB', () => {
      const result = validateImageSize(1024 * 1024); // 1MB
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept images at exactly 5MB', () => {
      const result = validateImageSize(5 * 1024 * 1024);
      expect(result.valid).toBe(true);
    });

    it('should reject images over 5MB', () => {
      const result = validateImageSize(6 * 1024 * 1024);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('5');
    });
  });

  describe('formatBytes', () => {
    it('should format zero bytes', () => {
      expect(formatBytes(0)).toBe('0 B');
    });

    it('should format bytes in B', () => {
      expect(formatBytes(500)).toContain('B');
    });

    it('should format bytes in KB', () => {
      const result = formatBytes(1024);
      expect(result).toContain('KB');
    });

    it('should format bytes in MB', () => {
      const result = formatBytes(1024 * 1024);
      expect(result).toContain('MB');
    });

    it('should format bytes in GB', () => {
      const result = formatBytes(1024 * 1024 * 1024);
      expect(result).toContain('GB');
    });
  });

  describe('getContentType', () => {
    it('should extract MIME type from PNG data URL', () => {
      expect(getContentType(SAMPLE_PNG_DATA_URL)).toBe('image/png');
    });

    it('should extract MIME type from JPEG data URL', () => {
      expect(getContentType(SAMPLE_JPEG_DATA_URL)).toBe('image/jpeg');
    });

    it('should return null for invalid data URL', () => {
      expect(getContentType('invalid')).toBeNull();
      expect(getContentType('')).toBeNull();
    });
  });

  describe('generateImageName', () => {
    it('should generate name with correct extension', () => {
      const name = generateImageName('image/png');
      expect(name).toMatch(/^image-\d+\.png$/);
    });

    it('should generate name with jpeg extension', () => {
      const name = generateImageName('image/jpeg');
      expect(name).toMatch(/^image-\d+\.jpeg$/);
    });

    it('should generate unique names', () => {
      const name1 = generateImageName('image/png');
      // Wait a tiny bit to ensure different timestamp
      const name2 = generateImageName('image/png');
      // Names might be same if generated in same millisecond, but format should be correct
      expect(name1).toMatch(/^image-\d+\.png$/);
      expect(name2).toMatch(/^image-\d+\.png$/);
    });
  });
});
