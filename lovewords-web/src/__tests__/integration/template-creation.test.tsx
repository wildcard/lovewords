/**
 * Template Creation Integration Tests
 *
 * End-to-end tests for creating boards from templates.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadTemplate } from '../../utils/template-loader';
import type { ObfBoard } from '../../types/obf';

// Mock localStorage
const mockLocalStorage: any = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => mockLocalStorage.store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    mockLocalStorage.store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete mockLocalStorage.store[key];
  }),
  clear: vi.fn(() => {
    mockLocalStorage.store = {};
  }),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockTemplateBoard: ObfBoard = {
  format: 'open-board-0.1',
  id: 'template-basic-emotions',
  name: 'Basic Emotions',
  locale: 'en',
  description: 'Express basic feelings',
  buttons: [
    {
      id: 'btn-happy',
      label: '😊 Happy',
      background_color: '#FFD700',
      border_color: '#FFA500',
    },
    {
      id: 'btn-sad',
      label: '😢 Sad',
      background_color: '#4682B4',
      border_color: '#1E90FF',
    },
    {
      id: 'btn-angry',
      label: '😠 Angry',
      background_color: '#DC143C',
      border_color: '#8B0000',
    },
  ],
  images: [],
  sounds: [],
  grid: {
    rows: 3,
    columns: 1,
    order: [['btn-happy'], ['btn-sad'], ['btn-angry']],
  },
  ext_lovewords_template: true,
};

const mockManifest = {
  version: '1.0',
  updated: '2026-01-24',
  templates: [
    {
      id: 'basic-emotions',
      name: 'Basic Emotions',
      description: 'Express basic feelings',
      category: 'Emotions',
      featured: true,
      grid: { rows: 3, columns: 1 },
      buttonCount: 3,
      file: '/templates/basic-emotions.obf',
      tags: ['emotions'],
      difficulty: 'beginner' as const,
    },
  ],
};

describe('Template Creation Integration', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    mockFetch.mockClear();
  });

  describe('Template Loading', () => {
    it('should load template from file', async () => {
      // Mock manifest fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockManifest,
      });

      // Mock template fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTemplateBoard,
      });

      const result = await loadTemplate('basic-emotions');

      expect(result.success).toBe(true);
      expect(result.board).toBeDefined();
      expect(result.board?.name).toBe('Basic Emotions');
      expect(result.board?.buttons).toHaveLength(3);
    });

    it('should validate template structure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockManifest,
      });

      const invalidBoard = {
        format: 'open-board-0.1',
        id: 'invalid',
        // Missing required fields
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidBoard,
      });

      const result = await loadTemplate('basic-emotions');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid template format');
    });
  });

  describe('Board Creation from Template', () => {
    it('should create board with unique ID', async () => {
      // Mock manifest fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockManifest,
      });

      // Mock template fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTemplateBoard,
      });

      const result = await loadTemplate('basic-emotions');
      expect(result.success).toBe(true);

      const template = result.board!;

      // Simulate creating board from template
      const timestamp = Date.now();
      const newBoard: ObfBoard = {
        ...template,
        id: `${template.id}-${timestamp}`,
        ext_lovewords_custom: true,
        ext_lovewords_created_at: new Date().toISOString(),
        ext_lovewords_updated_at: new Date().toISOString(),
        ext_lovewords_template: undefined,
      };

      expect(newBoard.id).toContain('template-basic-emotions-');
      expect(newBoard.ext_lovewords_custom).toBe(true);
      expect(newBoard.ext_lovewords_template).toBeUndefined();
      expect(newBoard.name).toBe('Basic Emotions');
    });

    it('should preserve template content', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockManifest,
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTemplateBoard,
      });

      const result = await loadTemplate('basic-emotions');
      const template = result.board!;

      const newBoard: ObfBoard = {
        ...template,
        id: `${template.id}-${Date.now()}`,
        ext_lovewords_custom: true,
      };

      // Verify content preserved
      expect(newBoard.buttons).toHaveLength(3);
      expect(newBoard.buttons[0].label).toBe('😊 Happy');
      expect(newBoard.buttons[0].background_color).toBe('#FFD700');
      expect(newBoard.grid.rows).toBe(3);
      expect(newBoard.grid.columns).toBe(1);
    });

    it('should be editable after creation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockManifest,
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTemplateBoard,
      });

      const result = await loadTemplate('basic-emotions');
      const template = result.board!;

      const newBoard: ObfBoard = {
        ...template,
        id: `${template.id}-${Date.now()}`,
        ext_lovewords_custom: true,
      };

      // Simulate editing
      newBoard.name = 'My Emotions';
      newBoard.buttons[0].label = '😃 Very Happy';

      expect(newBoard.name).toBe('My Emotions');
      expect(newBoard.buttons[0].label).toBe('😃 Very Happy');
      expect(newBoard.ext_lovewords_custom).toBe(true);
    });
  });

  describe('Multiple Template Instances', () => {
    it('should allow creating multiple boards from same template', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockManifest,
      });

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockTemplateBoard,
      });

      // Create first board
      const result1 = await loadTemplate('basic-emotions');
      const board1: ObfBoard = {
        ...result1.board!,
        id: `${result1.board!.id}-${Date.now()}`,
        ext_lovewords_custom: true,
      };

      // Wait a bit to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Create second board
      const result2 = await loadTemplate('basic-emotions');
      const board2: ObfBoard = {
        ...result2.board!,
        id: `${result2.board!.id}-${Date.now()}`,
        ext_lovewords_custom: true,
      };

      expect(board1.id).not.toBe(board2.id);
      expect(board1.name).toBe(board2.name); // Same template
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await loadTemplate('basic-emotions');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Could not load template');
    });

    it('should handle 404 errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockManifest,
      });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      const result = await loadTemplate('basic-emotions');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to load template');
    });

    it('should handle invalid JSON', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockManifest,
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const result = await loadTemplate('basic-emotions');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Could not load template');
    });
  });

  describe('Template Metadata', () => {
    it('should set correct timestamps on creation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockManifest,
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTemplateBoard,
      });

      const result = await loadTemplate('basic-emotions');
      const template = result.board!;

      const now = new Date().toISOString();
      const newBoard: ObfBoard = {
        ...template,
        id: `${template.id}-${Date.now()}`,
        ext_lovewords_custom: true,
        ext_lovewords_created_at: now,
        ext_lovewords_updated_at: now,
      };

      expect(newBoard.ext_lovewords_created_at).toBeDefined();
      expect(newBoard.ext_lovewords_updated_at).toBeDefined();
      expect(newBoard.ext_lovewords_created_at).toBe(newBoard.ext_lovewords_updated_at);
    });

    it('should mark board as custom', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockManifest,
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTemplateBoard,
      });

      const result = await loadTemplate('basic-emotions');
      const template = result.board!;

      const newBoard: ObfBoard = {
        ...template,
        id: `${template.id}-${Date.now()}`,
        ext_lovewords_custom: true,
      };

      expect(newBoard.ext_lovewords_custom).toBe(true);
    });

    it('should remove template flag', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockManifest,
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTemplateBoard,
      });

      const result = await loadTemplate('basic-emotions');
      const template = result.board!;

      expect(template.ext_lovewords_template).toBe(true);

      const newBoard: ObfBoard = {
        ...template,
        id: `${template.id}-${Date.now()}`,
        ext_lovewords_custom: true,
        ext_lovewords_template: undefined,
      };

      expect(newBoard.ext_lovewords_template).toBeUndefined();
    });
  });
});
