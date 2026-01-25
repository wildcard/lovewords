/**
 * Tests for image-migration utility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  migrateBoard,
  migrateAllBoards,
  isMigrationComplete,
  markMigrationComplete,
  resetMigrationStatus,
} from '../image-migration';
import { imageLibrary } from '../../storage/image-library-backend';
import type { ObfBoard } from '../../types/obf';

// Mock the image library
vi.mock('../../storage/image-library-backend', () => ({
  imageLibrary: {
    addImage: vi.fn(),
    incrementUsage: vi.fn(),
  },
}));

// Sample test data
const SAMPLE_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const createTestBoard = (overrides: Partial<ObfBoard> = {}): ObfBoard => ({
  format: 'open-board-0.1',
  id: 'test-board',
  name: 'Test Board',
  locale: 'en',
  buttons: [],
  images: [],
  sounds: [],
  grid: { rows: 2, columns: 2, order: [[null, null], [null, null]] },
  ext_lovewords_custom: true,
  ...overrides,
});

describe('image-migration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('isMigrationComplete', () => {
    it('should return false when migration not run', () => {
      expect(isMigrationComplete()).toBe(false);
    });

    it('should return true after marking complete', () => {
      markMigrationComplete();
      expect(isMigrationComplete()).toBe(true);
    });
  });

  describe('markMigrationComplete', () => {
    it('should set migration version in localStorage', () => {
      markMigrationComplete();
      expect(localStorage.getItem('lovewords_image_migration_version')).toBe('1');
    });
  });

  describe('resetMigrationStatus', () => {
    it('should clear migration status', () => {
      markMigrationComplete();
      expect(isMigrationComplete()).toBe(true);

      resetMigrationStatus();
      expect(isMigrationComplete()).toBe(false);
    });
  });

  describe('migrateBoard', () => {
    it('should skip non-custom boards', async () => {
      const board = createTestBoard({ ext_lovewords_custom: false });

      const { migratedBoard, result } = await migrateBoard(board);

      expect(result.needsSave).toBe(false);
      expect(result.buttonsUpdated).toBe(0);
      expect(migratedBoard).toEqual(board);
    });

    it('should skip buttons that already have imageLibraryId', async () => {
      const board = createTestBoard({
        buttons: [
          { id: 'btn-1', label: 'Test', imageLibraryId: 'existing-id' },
        ],
        images: [{ id: 'img-1', data: SAMPLE_DATA_URL }],
      });

      const { result } = await migrateBoard(board);

      expect(result.buttonsUpdated).toBe(0);
      expect(result.needsSave).toBe(false);
    });

    it('should migrate buttons with image_id to imageLibraryId', async () => {
      vi.mocked(imageLibrary.addImage).mockResolvedValue({
        success: true,
        imageId: 'library-id-123',
        isDuplicate: false,
      });
      vi.mocked(imageLibrary.incrementUsage).mockResolvedValue();

      const board = createTestBoard({
        buttons: [
          { id: 'btn-1', label: 'Test', image_id: 'img-1' },
        ],
        images: [{ id: 'img-1', data: SAMPLE_DATA_URL }],
      });

      const { migratedBoard, result } = await migrateBoard(board);

      expect(result.buttonsUpdated).toBe(1);
      expect(result.imagesAdded).toBe(1);
      expect(result.needsSave).toBe(true);
      expect(migratedBoard.buttons[0].imageLibraryId).toBe('library-id-123');
      expect(imageLibrary.incrementUsage).toHaveBeenCalledWith('library-id-123');
    });

    it('should track deduplicated images', async () => {
      vi.mocked(imageLibrary.addImage).mockResolvedValue({
        success: true,
        imageId: 'existing-library-id',
        isDuplicate: true,
      });
      vi.mocked(imageLibrary.incrementUsage).mockResolvedValue();

      const board = createTestBoard({
        buttons: [
          { id: 'btn-1', label: 'Test', image_id: 'img-1' },
        ],
        images: [{ id: 'img-1', data: SAMPLE_DATA_URL }],
      });

      const { result } = await migrateBoard(board);

      expect(result.imagesAdded).toBe(0);
      expect(result.imagesDeduplicated).toBe(1);
      expect(result.buttonsUpdated).toBe(1);
    });

    it('should skip buttons with image_id but no matching image data', async () => {
      const board = createTestBoard({
        buttons: [
          { id: 'btn-1', label: 'Test', image_id: 'missing-img' },
        ],
        images: [], // No images in board
      });

      const { result } = await migrateBoard(board);

      expect(result.buttonsUpdated).toBe(0);
      expect(result.needsSave).toBe(false);
    });

    it('should handle multiple buttons', async () => {
      vi.mocked(imageLibrary.addImage).mockResolvedValue({
        success: true,
        imageId: 'library-id',
        isDuplicate: false,
      });
      vi.mocked(imageLibrary.incrementUsage).mockResolvedValue();

      const board = createTestBoard({
        buttons: [
          { id: 'btn-1', label: 'Button 1', image_id: 'img-1' },
          { id: 'btn-2', label: 'Button 2', image_id: 'img-2' },
          { id: 'btn-3', label: 'Button 3' }, // No image
        ],
        images: [
          { id: 'img-1', data: SAMPLE_DATA_URL },
          { id: 'img-2', data: SAMPLE_DATA_URL },
        ],
      });

      const { result } = await migrateBoard(board);

      expect(result.buttonsUpdated).toBe(2);
      expect(result.needsSave).toBe(true);
    });
  });

  describe('migrateAllBoards', () => {
    it('should skip if migration already complete', async () => {
      markMigrationComplete();

      const loadBoards = vi.fn();
      const saveBoard = vi.fn();

      const result = await migrateAllBoards(loadBoards, saveBoard);

      expect(loadBoards).not.toHaveBeenCalled();
      expect(result.boardsProcessed).toBe(0);
    });

    it('should run migration if forced', async () => {
      markMigrationComplete();

      const loadBoards = vi.fn().mockResolvedValue([]);
      const saveBoard = vi.fn();

      const result = await migrateAllBoards(loadBoards, saveBoard, { force: true });

      expect(loadBoards).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('should process all boards', async () => {
      vi.mocked(imageLibrary.addImage).mockResolvedValue({
        success: true,
        imageId: 'library-id',
        isDuplicate: false,
      });
      vi.mocked(imageLibrary.incrementUsage).mockResolvedValue();

      const boards = [
        createTestBoard({
          id: 'board-1',
          buttons: [{ id: 'btn-1', label: 'Test', image_id: 'img-1' }],
          images: [{ id: 'img-1', data: SAMPLE_DATA_URL }],
        }),
        createTestBoard({
          id: 'board-2',
          buttons: [{ id: 'btn-2', label: 'Test 2', image_id: 'img-2' }],
          images: [{ id: 'img-2', data: SAMPLE_DATA_URL }],
        }),
      ];

      const loadBoards = vi.fn().mockResolvedValue(boards);
      const saveBoard = vi.fn();

      const result = await migrateAllBoards(loadBoards, saveBoard);

      expect(result.boardsProcessed).toBe(2);
      expect(result.buttonsUpdated).toBe(2);
      expect(saveBoard).toHaveBeenCalledTimes(2);
      expect(result.success).toBe(true);
    });

    it('should mark migration complete after success', async () => {
      const loadBoards = vi.fn().mockResolvedValue([]);
      const saveBoard = vi.fn();

      await migrateAllBoards(loadBoards, saveBoard);

      expect(isMigrationComplete()).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      vi.mocked(imageLibrary.addImage).mockRejectedValue(new Error('Storage error'));

      const board = createTestBoard({
        buttons: [{ id: 'btn-1', label: 'Test', image_id: 'img-1' }],
        images: [{ id: 'img-1', data: SAMPLE_DATA_URL }],
      });

      const loadBoards = vi.fn().mockResolvedValue([board]);
      const saveBoard = vi.fn();

      const result = await migrateAllBoards(loadBoards, saveBoard);

      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
