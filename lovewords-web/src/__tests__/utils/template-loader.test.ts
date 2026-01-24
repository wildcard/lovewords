/**
 * Template Loader Tests
 *
 * Tests for template loading and filtering utilities.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  loadTemplateManifest,
  loadTemplate,
  filterTemplates,
  getCategories,
  getFeaturedTemplates,
  clearManifestCache,
} from '../../utils/template-loader';
import type { TemplateManifest, TemplateMetadata } from '../../types/template-catalog';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock template manifest
const mockManifest: TemplateManifest = {
  version: '1.0',
  updated: '2026-01-24',
  templates: [
    {
      id: 'basic-emotions',
      name: 'Basic Emotions',
      description: 'Express basic feelings and emotions',
      category: 'Emotions',
      featured: true,
      grid: { rows: 3, columns: 3 },
      buttonCount: 9,
      file: '/templates/basic-emotions.obf',
      tags: ['emotions', 'feelings', 'beginner'],
      difficulty: 'beginner',
    },
    {
      id: 'core-needs',
      name: 'Core Needs',
      description: 'Basic communication needs and requests',
      category: 'Daily Life',
      featured: true,
      grid: { rows: 4, columns: 4 },
      buttonCount: 16,
      file: '/templates/core-needs.obf',
      tags: ['needs', 'requests', 'essential'],
      difficulty: 'beginner',
    },
    {
      id: 'daily-routine',
      name: 'Daily Routine',
      description: 'Daily activities and schedule',
      category: 'Daily Life',
      featured: false,
      grid: { rows: 4, columns: 4 },
      buttonCount: 16,
      file: '/templates/daily-routine.obf',
      tags: ['routine', 'schedule', 'activities'],
      difficulty: 'beginner',
    },
  ],
};

// Mock template OBF
const mockTemplateBoard = {
  format: 'open-board-0.1',
  id: 'template-basic-emotions',
  name: 'Basic Emotions',
  buttons: [
    { id: 'btn-1', label: 'Happy', background_color: '#FFD700' },
    { id: 'btn-2', label: 'Sad', background_color: '#4682B4' },
  ],
  images: [],
  sounds: [],
  grid: {
    rows: 2,
    columns: 1,
    order: [['btn-1'], ['btn-2']],
  },
};

describe('loadTemplateManifest', () => {
  beforeEach(() => {
    clearManifestCache();
    mockFetch.mockClear();
  });

  it('should load template manifest successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockManifest,
    });

    const manifest = await loadTemplateManifest();

    expect(manifest).toEqual(mockManifest);
    expect(mockFetch).toHaveBeenCalledWith('/templates/templates-manifest.json');
  });

  it('should cache manifest after first load', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockManifest,
    });

    // First call
    await loadTemplateManifest();
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Second call should use cache
    await loadTemplateManifest();
    expect(mockFetch).toHaveBeenCalledTimes(1); // Still 1, not 2
  });

  it('should throw error on fetch failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(loadTemplateManifest()).rejects.toThrow(
      'Could not load templates. Please try again later.'
    );
  });

  it('should throw error on invalid manifest format', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ invalid: 'data' }),
    });

    await expect(loadTemplateManifest()).rejects.toThrow(
      'Could not load templates. Please try again later.'
    );
  });

  it('should throw error on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(loadTemplateManifest()).rejects.toThrow(
      'Could not load templates. Please try again later.'
    );
  });
});

describe('loadTemplate', () => {
  beforeEach(() => {
    clearManifestCache();
    mockFetch.mockClear();
  });

  it('should load template successfully', async () => {
    // Mock manifest fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockManifest,
    });

    // Mock template OBF fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTemplateBoard,
    });

    const result = await loadTemplate('basic-emotions');

    expect(result.success).toBe(true);
    expect(result.board).toEqual(mockTemplateBoard);
    expect(result.error).toBeUndefined();
  });

  it('should return error for non-existent template', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockManifest,
    });

    const result = await loadTemplate('non-existent');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Template "non-existent" not found');
  });

  it('should return error on template fetch failure', async () => {
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
    expect(result.error).toBe('Failed to load template: Not Found');
  });

  it('should validate OBF structure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockManifest,
    });

    // Invalid OBF (missing required fields)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ invalid: 'board' }),
    });

    const result = await loadTemplate('basic-emotions');

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid template format');
  });
});

describe('filterTemplates', () => {
  const templates: TemplateMetadata[] = mockManifest.templates;

  it('should return all templates with no filters', () => {
    const filtered = filterTemplates(templates);
    expect(filtered).toHaveLength(3);
  });

  it('should filter by search query (name)', () => {
    const filtered = filterTemplates(templates, { query: 'emotions' });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('basic-emotions');
  });

  it('should filter by search query (description)', () => {
    const filtered = filterTemplates(templates, { query: 'schedule' });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('daily-routine');
  });

  it('should filter by search query (tags)', () => {
    const filtered = filterTemplates(templates, { query: 'essential' });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('core-needs');
  });

  it('should filter by search query case-insensitive', () => {
    const filtered = filterTemplates(templates, { query: 'EMOTIONS' });
    expect(filtered).toHaveLength(1);
  });

  it('should filter by category', () => {
    const filtered = filterTemplates(templates, { category: 'Daily Life' });
    expect(filtered).toHaveLength(2);
    expect(filtered.every((t) => t.category === 'Daily Life')).toBe(true);
  });

  it('should not filter when category is "All"', () => {
    const filtered = filterTemplates(templates, { category: 'All' });
    expect(filtered).toHaveLength(3);
  });

  it('should filter by featured status', () => {
    const filtered = filterTemplates(templates, { featured: true });
    expect(filtered).toHaveLength(2);
    expect(filtered.every((t) => t.featured)).toBe(true);
  });

  it('should filter by difficulty', () => {
    const filtered = filterTemplates(templates, { difficulty: 'beginner' });
    expect(filtered).toHaveLength(3);
  });

  it('should combine multiple filters', () => {
    const filtered = filterTemplates(templates, {
      category: 'Daily Life',
      featured: true,
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('core-needs');
  });

  it('should return empty array if no matches', () => {
    const filtered = filterTemplates(templates, { query: 'nonexistent' });
    expect(filtered).toHaveLength(0);
  });
});

describe('getCategories', () => {
  const templates: TemplateMetadata[] = mockManifest.templates;

  it('should return unique categories with "All" first', () => {
    const categories = getCategories(templates);
    expect(categories).toEqual(['All', 'Daily Life', 'Emotions']);
  });

  it('should return only "All" for empty array', () => {
    const categories = getCategories([]);
    expect(categories).toEqual(['All']);
  });

  it('should sort categories alphabetically (excluding "All")', () => {
    const moreTemplates: TemplateMetadata[] = [
      ...templates,
      {
        id: 'test',
        name: 'Test',
        description: 'Test',
        category: 'Zebra Category',
        featured: false,
        grid: { rows: 2, columns: 2 },
        buttonCount: 4,
        file: '/test.obf',
        tags: [],
        difficulty: 'beginner',
      },
      {
        id: 'test2',
        name: 'Test2',
        description: 'Test2',
        category: 'Alpha Category',
        featured: false,
        grid: { rows: 2, columns: 2 },
        buttonCount: 4,
        file: '/test2.obf',
        tags: [],
        difficulty: 'beginner',
      },
    ];

    const categories = getCategories(moreTemplates);
    expect(categories).toEqual(['All', 'Alpha Category', 'Daily Life', 'Emotions', 'Zebra Category']);
  });
});

describe('getFeaturedTemplates', () => {
  const templates: TemplateMetadata[] = mockManifest.templates;

  it('should return only featured templates', () => {
    const featured = getFeaturedTemplates(templates);
    expect(featured).toHaveLength(2);
    expect(featured.every((t) => t.featured)).toBe(true);
  });

  it('should return empty array if no featured templates', () => {
    const nonFeatured = templates.map((t) => ({ ...t, featured: false }));
    const featured = getFeaturedTemplates(nonFeatured);
    expect(featured).toHaveLength(0);
  });
});

describe('clearManifestCache', () => {
  beforeEach(() => {
    clearManifestCache();
    mockFetch.mockClear();
  });

  it('should clear cache and force reload', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockManifest,
    });

    // First load
    await loadTemplateManifest();
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Clear cache
    clearManifestCache();

    // Should fetch again
    await loadTemplateManifest();
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
