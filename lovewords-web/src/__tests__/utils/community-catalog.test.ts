/**
 * Unit tests for community catalog utilities
 *
 * Tests cover:
 * - Pure functions: filterBoards, sortBoards, getCategoryBoards, getFeaturedBoards, getNewBoards
 * - Async functions: fetchCatalog with caching
 * - Cache utilities: clearCatalogCache, getCacheAge, isCacheFresh
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchCatalog,
  filterBoards,
  sortBoards,
  getCategoryBoards,
  getFeaturedBoards,
  getNewBoards,
  clearCatalogCache,
  getCacheAge,
  isCacheFresh,
} from '../../utils/community-catalog';
import type { CommunityBoard, FilterOptions, SortOption } from '../../types/community-catalog';
import {
  minimalCatalog,
  richCatalog,
  createBoard,
  createCatalogWithDates,
  createCachedCatalog,
  invalidCatalogs,
  boardsWithSameButtonCount,
} from '../../__mocks__/catalog-fixtures';

// ============================================================================
// PART 1: PURE FUNCTIONS - filterBoards()
// ============================================================================

describe('filterBoards()', () => {
  describe('query filter', () => {
    it('returns all boards when query is empty string', () => {
      const options: FilterOptions = { query: '' };
      const result = filterBoards(richCatalog.boards, options);

      expect(result).toHaveLength(richCatalog.boards.length);
    });

    it('returns all boards when query is undefined', () => {
      const options: FilterOptions = {};
      const result = filterBoards(richCatalog.boards, options);

      expect(result).toHaveLength(richCatalog.boards.length);
    });

    it('filters boards by name match', () => {
      const options: FilterOptions = { query: 'emotions' };
      const result = filterBoards(richCatalog.boards, options);

      expect(result.length).toBeGreaterThan(0);
      expect(result.every((b) => b.name.toLowerCase().includes('emotions'))).toBe(true);
    });

    it('filters boards by description match', () => {
      const options: FilterOptions = { query: 'daily' };
      const result = filterBoards(richCatalog.boards, options);

      expect(result.length).toBeGreaterThan(0);
      expect(
        result.every(
          (b) =>
            b.description.toLowerCase().includes('daily') ||
            b.name.toLowerCase().includes('daily')
        )
      ).toBe(true);
    });

    it('filters boards by tag match', () => {
      const options: FilterOptions = { query: 'aac' };
      const result = filterBoards(richCatalog.boards, options);

      expect(result.length).toBeGreaterThan(0);
      expect(result.every((b) => b.tags.some((t) => t.toLowerCase().includes('aac')))).toBe(
        true
      );
    });

    it('search is case-insensitive', () => {
      const lowerResult = filterBoards(richCatalog.boards, { query: 'emotions' });
      const upperResult = filterBoards(richCatalog.boards, { query: 'EMOTIONS' });
      const mixedResult = filterBoards(richCatalog.boards, { query: 'EmOtIoNs' });

      expect(lowerResult).toEqual(upperResult);
      expect(lowerResult).toEqual(mixedResult);
    });

    it('returns empty array when query matches nothing', () => {
      const options: FilterOptions = { query: 'zzzznonexistent' };
      const result = filterBoards(richCatalog.boards, options);

      expect(result).toHaveLength(0);
    });
  });

  describe('category filter', () => {
    it('filters boards by category', () => {
      const options: FilterOptions = { category: 'emotions' };
      const result = filterBoards(richCatalog.boards, options);

      expect(result.length).toBeGreaterThan(0);
      expect(result.every((b) => b.category === 'emotions')).toBe(true);
    });

    it('returns empty array for category with no boards', () => {
      const options: FilterOptions = { category: 'nonexistent-category' };
      const result = filterBoards(richCatalog.boards, options);

      expect(result).toHaveLength(0);
    });

    it('returns all boards when category is undefined', () => {
      const options: FilterOptions = { category: undefined };
      const result = filterBoards(richCatalog.boards, options);

      expect(result).toHaveLength(richCatalog.boards.length);
    });
  });

  describe('tags filter', () => {
    it('filters boards by single tag', () => {
      const options: FilterOptions = { tags: ['aac'] };
      const result = filterBoards(richCatalog.boards, options);

      expect(result.length).toBeGreaterThan(0);
      expect(result.every((b) => b.tags.some((t) => t.toLowerCase() === 'aac'))).toBe(true);
    });

    it('filters boards by multiple tags (AND logic - must have ALL tags)', () => {
      const options: FilterOptions = { tags: ['aac', 'beginner'] };
      const result = filterBoards(richCatalog.boards, options);

      expect(result.length).toBeGreaterThan(0);
      result.forEach((board) => {
        const boardTagsLower = board.tags.map((t) => t.toLowerCase());
        expect(boardTagsLower).toContain('aac');
        expect(boardTagsLower).toContain('beginner');
      });
    });

    it('tag filter is case-insensitive', () => {
      const lowerResult = filterBoards(richCatalog.boards, { tags: ['aac'] });
      const upperResult = filterBoards(richCatalog.boards, { tags: ['AAC'] });

      expect(lowerResult).toEqual(upperResult);
    });

    it('returns empty array when no boards have all specified tags', () => {
      const options: FilterOptions = { tags: ['aac', 'nonexistent-tag'] };
      const result = filterBoards(richCatalog.boards, options);

      expect(result).toHaveLength(0);
    });

    it('returns all boards when tags array is empty', () => {
      const options: FilterOptions = { tags: [] };
      const result = filterBoards(richCatalog.boards, options);

      expect(result).toHaveLength(richCatalog.boards.length);
    });
  });

  describe('gridSize filter', () => {
    it('filters boards by grid size', () => {
      const options: FilterOptions = { gridSize: '4x4' };
      const result = filterBoards(richCatalog.boards, options);

      expect(result.length).toBeGreaterThan(0);
      expect(result.every((b) => b.grid.rows === 4 && b.grid.columns === 4)).toBe(true);
    });

    it('filters boards by different grid size', () => {
      const options: FilterOptions = { gridSize: '3x5' };
      const result = filterBoards(richCatalog.boards, options);

      expect(result.length).toBeGreaterThan(0);
      expect(result.every((b) => b.grid.rows === 3 && b.grid.columns === 5)).toBe(true);
    });

    it('returns empty array when no boards match grid size', () => {
      const options: FilterOptions = { gridSize: '10x10' };
      const result = filterBoards(richCatalog.boards, options);

      expect(result).toHaveLength(0);
    });

    it('returns all boards when gridSize is undefined', () => {
      const options: FilterOptions = { gridSize: undefined };
      const result = filterBoards(richCatalog.boards, options);

      expect(result).toHaveLength(richCatalog.boards.length);
    });
  });

  describe('combined filters', () => {
    it('applies multiple filters (AND logic)', () => {
      const options: FilterOptions = {
        query: 'basic',
        category: 'emotions',
      };
      const result = filterBoards(richCatalog.boards, options);

      expect(result.length).toBeGreaterThan(0);
      result.forEach((board) => {
        const matchesQuery =
          board.name.toLowerCase().includes('basic') ||
          board.description.toLowerCase().includes('basic') ||
          board.tags.some((t) => t.toLowerCase().includes('basic'));
        expect(matchesQuery).toBe(true);
        expect(board.category).toBe('emotions');
      });
    });

    it('returns empty when combined filters have no match', () => {
      const options: FilterOptions = {
        query: 'basic',
        category: 'daily', // No 'basic' boards in 'daily' category
      };
      const result = filterBoards(richCatalog.boards, options);

      expect(result).toHaveLength(0);
    });

    it('combines all filter types', () => {
      const options: FilterOptions = {
        query: 'emotions',
        category: 'emotions',
        tags: ['aac'],
        gridSize: '4x4',
      };
      const result = filterBoards(richCatalog.boards, options);

      result.forEach((board) => {
        const matchesQuery =
          board.name.toLowerCase().includes('emotions') ||
          board.description.toLowerCase().includes('emotions') ||
          board.tags.some((t) => t.toLowerCase().includes('emotions'));
        expect(matchesQuery).toBe(true);
        expect(board.category).toBe('emotions');
        expect(board.tags.map((t) => t.toLowerCase())).toContain('aac');
        expect(board.grid.rows).toBe(4);
        expect(board.grid.columns).toBe(4);
      });
    });
  });

  describe('edge cases', () => {
    it('returns empty array when boards array is empty', () => {
      const result = filterBoards([], { query: 'test' });

      expect(result).toHaveLength(0);
    });

    it('handles empty filter options', () => {
      const result = filterBoards(richCatalog.boards, {});

      expect(result).toHaveLength(richCatalog.boards.length);
    });
  });
});

// ============================================================================
// PART 2: PURE FUNCTIONS - sortBoards()
// ============================================================================

describe('sortBoards()', () => {
  describe('sort by name', () => {
    it('sorts boards alphabetically by name (A-Z)', () => {
      const result = sortBoards(richCatalog.boards, 'name');

      for (let i = 1; i < result.length; i++) {
        expect(result[i - 1].name.localeCompare(result[i].name)).toBeLessThanOrEqual(0);
      }
    });

    it('places Alpha Board before Zebra Board when sorted by name', () => {
      const result = sortBoards(richCatalog.boards, 'name');
      const alphaIndex = result.findIndex((b) => b.name.includes('Alpha'));
      const zebraIndex = result.findIndex((b) => b.name.includes('Zebra'));

      expect(alphaIndex).toBeLessThan(zebraIndex);
    });
  });

  describe('sort by newest', () => {
    it('sorts boards by created date descending (newest first)', () => {
      const result = sortBoards(richCatalog.boards, 'newest');

      for (let i = 1; i < result.length; i++) {
        const prevDate = new Date(result[i - 1].created).getTime();
        const currDate = new Date(result[i].created).getTime();
        expect(prevDate).toBeGreaterThanOrEqual(currDate);
      }
    });

    it('places most recently created board first', () => {
      const result = sortBoards(richCatalog.boards, 'newest');
      const newestBoard = richCatalog.boards.reduce((a, b) =>
        new Date(a.created) > new Date(b.created) ? a : b
      );

      expect(result[0].id).toBe(newestBoard.id);
    });
  });

  describe('sort by oldest', () => {
    it('sorts boards by created date ascending (oldest first)', () => {
      const result = sortBoards(richCatalog.boards, 'oldest');

      for (let i = 1; i < result.length; i++) {
        const prevDate = new Date(result[i - 1].created).getTime();
        const currDate = new Date(result[i].created).getTime();
        expect(prevDate).toBeLessThanOrEqual(currDate);
      }
    });

    it('places oldest created board first', () => {
      const result = sortBoards(richCatalog.boards, 'oldest');
      const oldestBoard = richCatalog.boards.reduce((a, b) =>
        new Date(a.created) < new Date(b.created) ? a : b
      );

      expect(result[0].id).toBe(oldestBoard.id);
    });
  });

  describe('sort by buttons', () => {
    it('sorts boards by button count descending (most buttons first)', () => {
      const result = sortBoards(richCatalog.boards, 'buttons');

      for (let i = 1; i < result.length; i++) {
        expect(result[i - 1].buttons).toBeGreaterThanOrEqual(result[i].buttons);
      }
    });

    it('places board with most buttons first', () => {
      const result = sortBoards(richCatalog.boards, 'buttons');
      const maxButtons = Math.max(...richCatalog.boards.map((b) => b.buttons));

      expect(result[0].buttons).toBe(maxButtons);
    });
  });

  describe('sort by downloads', () => {
    it('sorts boards by download count descending (most downloads first)', () => {
      const result = sortBoards(richCatalog.boards, 'downloads');

      for (let i = 1; i < result.length; i++) {
        expect(result[i - 1].downloads).toBeGreaterThanOrEqual(result[i].downloads);
      }
    });

    it('places board with most downloads first', () => {
      const result = sortBoards(richCatalog.boards, 'downloads');
      const maxDownloads = Math.max(...richCatalog.boards.map((b) => b.downloads));

      expect(result[0].downloads).toBe(maxDownloads);
    });
  });

  describe('edge cases', () => {
    it('returns array unchanged for unknown sort option', () => {
      const boards = [...richCatalog.boards];
      const result = sortBoards(boards, 'invalid' as SortOption);

      expect(result).toEqual(boards);
    });

    it('returns empty array when given empty array', () => {
      const result = sortBoards([], 'name');

      expect(result).toHaveLength(0);
    });

    it('returns same single item when given single item array', () => {
      const singleBoard = [createBoard({ id: 'single', name: 'Single Board' })];
      const result = sortBoards(singleBoard, 'name');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('single');
    });

    it('maintains stable sort order for equal values', () => {
      // Boards with same button count should maintain relative order
      const result = sortBoards(boardsWithSameButtonCount, 'buttons');

      // All have same button count, so original order should be preserved
      expect(result[0].id).toBe('same-1');
      expect(result[1].id).toBe('same-2');
      expect(result[2].id).toBe('same-3');
    });

    it('does not mutate the original array', () => {
      const originalBoards = [...richCatalog.boards];
      const originalOrder = originalBoards.map((b) => b.id);

      sortBoards(originalBoards, 'name');

      expect(originalBoards.map((b) => b.id)).toEqual(originalOrder);
    });
  });
});

// ============================================================================
// PART 3: PURE FUNCTIONS - getCategoryBoards()
// ============================================================================

describe('getCategoryBoards()', () => {
  it('returns boards in specified category', () => {
    const result = getCategoryBoards(richCatalog, 'emotions');

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((b) => b.category === 'emotions')).toBe(true);
  });

  it('returns empty array for empty category', () => {
    const result = getCategoryBoards(richCatalog, '');

    expect(result).toHaveLength(0);
  });

  it('returns empty array for nonexistent category', () => {
    const result = getCategoryBoards(richCatalog, 'nonexistent-category');

    expect(result).toHaveLength(0);
  });

  it('returns empty array when catalog has no boards', () => {
    const result = getCategoryBoards(minimalCatalog, 'emotions');

    expect(result).toHaveLength(0);
  });
});

// ============================================================================
// PART 4: PURE FUNCTIONS - getFeaturedBoards()
// ============================================================================

describe('getFeaturedBoards()', () => {
  it('returns boards that are in the featured list', () => {
    const result = getFeaturedBoards(richCatalog);

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((b) => richCatalog.featured.includes(b.id))).toBe(true);
  });

  it('returns all featured boards', () => {
    const result = getFeaturedBoards(richCatalog);

    expect(result.length).toBe(richCatalog.featured.length);
  });

  it('returns empty array when no boards are featured', () => {
    const catalogWithNoFeatured = {
      ...richCatalog,
      featured: [],
    };
    const result = getFeaturedBoards(catalogWithNoFeatured);

    expect(result).toHaveLength(0);
  });

  it('skips featured IDs that do not match any board', () => {
    const catalogWithInvalidFeatured = {
      ...richCatalog,
      featured: ['b1', 'nonexistent-board-id', 'b3'],
    };
    const result = getFeaturedBoards(catalogWithInvalidFeatured);

    // Should only return b1 and b3, skipping nonexistent
    expect(result.length).toBe(2);
    expect(result.map((b) => b.id)).toContain('b1');
    expect(result.map((b) => b.id)).toContain('b3');
  });

  it('returns empty array when catalog has no boards', () => {
    const result = getFeaturedBoards(minimalCatalog);

    expect(result).toHaveLength(0);
  });
});

// ============================================================================
// PART 5: PURE FUNCTIONS - getNewBoards()
// ============================================================================

describe('getNewBoards()', () => {
  const referenceDate = new Date('2026-01-24T12:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(referenceDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns boards created within N days', () => {
    const catalog = createCatalogWithDates(referenceDate);
    const result = getNewBoards(catalog, 7);

    // Should include: new-1 (1 day old), new-7 (exactly 7 days old), future
    expect(result.length).toBeGreaterThan(0);
    result.forEach((board) => {
      const boardDate = new Date(board.created);
      const daysDiff = (referenceDate.getTime() - boardDate.getTime()) / (1000 * 60 * 60 * 24);
      expect(daysDiff).toBeLessThanOrEqual(7);
    });
  });

  it('returns empty array when no boards within N days', () => {
    const catalog = createCatalogWithDates(referenceDate);
    const result = getNewBoards(catalog, 0);

    // Only future board should qualify (negative days)
    const nonFutureBoards = result.filter(
      (b) => new Date(b.created) <= referenceDate
    );
    expect(nonFutureBoards).toHaveLength(0);
  });

  it('includes boards exactly N days old (boundary condition)', () => {
    const catalog = createCatalogWithDates(referenceDate);
    const result = getNewBoards(catalog, 7);

    const exactlySevenDaysBoard = result.find((b) => b.id === 'new-7');
    expect(exactlySevenDaysBoard).toBeDefined();
  });

  it('excludes boards older than N days', () => {
    const catalog = createCatalogWithDates(referenceDate);
    const result = getNewBoards(catalog, 7);

    const oldBoard = result.find((b) => b.id === 'old-8');
    expect(oldBoard).toBeUndefined();
  });

  it('includes boards with future dates', () => {
    const catalog = createCatalogWithDates(referenceDate);
    const result = getNewBoards(catalog, 7);

    const futureBoard = result.find((b) => b.id === 'future');
    expect(futureBoard).toBeDefined();
  });

  it('returns empty array when catalog has no boards', () => {
    const result = getNewBoards(minimalCatalog, 7);

    expect(result).toHaveLength(0);
  });
});

// ============================================================================
// PART 6: ASYNC FUNCTIONS - fetchCatalog()
// ============================================================================

describe('fetchCatalog()', () => {
  // Mock fetch and localStorage
  const mockFetch = vi.fn();
  const mockLocalStorage = {
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

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-24T12:00:00Z'));

    // Reset mocks
    mockFetch.mockReset();
    mockLocalStorage.store = {};
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();

    // Install mocks
    global.fetch = mockFetch;
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('fresh fetch (no cache)', () => {
    it('fetches catalog from network when no cache exists', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(richCatalog),
      });

      const result = await fetchCatalog();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(richCatalog);
    });

    it('caches successful fetch result', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(richCatalog),
      });

      await fetchCatalog();

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      const cacheKey = mockLocalStorage.setItem.mock.calls[0][0];
      const cachedValue = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(cachedValue.data).toEqual(richCatalog);
      expect(cachedValue.timestamp).toBeDefined();
    });
  });

  describe('cache hit - fresh cache', () => {
    it('returns cached catalog without fetching when cache is fresh', async () => {
      // Set up fresh cache (less than 1 hour old)
      const freshCache = createCachedCatalog(richCatalog, Date.now() - 1000 * 60 * 30); // 30 min old
      mockLocalStorage.store['lovewords_community_catalog_cache'] = JSON.stringify(freshCache);

      const result = await fetchCatalog();

      expect(mockFetch).not.toHaveBeenCalled();
      expect(result).toEqual(richCatalog);
    });
  });

  describe('cache hit - stale cache', () => {
    it('fetches fresh data when cache is stale', async () => {
      // Set up stale cache (more than 1 hour old)
      const staleCache = createCachedCatalog(
        richCatalog,
        Date.now() - 1000 * 60 * 61 // 61 min old
      );
      mockLocalStorage.store['lovewords_community_catalog_cache'] = JSON.stringify(staleCache);

      const updatedCatalog = { ...richCatalog, version: '2.0' };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(updatedCatalog),
      });

      const result = await fetchCatalog();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedCatalog);
    });

    it('returns stale cache when fetch fails', async () => {
      // Set up stale cache
      const staleCache = createCachedCatalog(
        richCatalog,
        Date.now() - 1000 * 60 * 61 // 61 min old
      );
      mockLocalStorage.store['lovewords_community_catalog_cache'] = JSON.stringify(staleCache);

      mockFetch.mockRejectedValue(new Error('Network error'));
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = await fetchCatalog();

      expect(result).toEqual(richCatalog);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('stale'),
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('force refresh', () => {
    it('ignores cache when forceRefresh is true', async () => {
      // Set up fresh cache
      const freshCache = createCachedCatalog(richCatalog, Date.now() - 1000 * 60 * 5); // 5 min old
      mockLocalStorage.store['lovewords_community_catalog_cache'] = JSON.stringify(freshCache);

      const updatedCatalog = { ...richCatalog, version: '2.0' };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(updatedCatalog),
      });

      const result = await fetchCatalog(true);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedCatalog);
    });
  });

  describe('error handling', () => {
    it('throws error on network failure with no cache', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(fetchCatalog()).rejects.toThrow('Network error');
    });

    it('throws error on HTTP error (404)', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(fetchCatalog()).rejects.toThrow('Not Found');
    });

    it('throws error on HTTP error (500)', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error',
      });

      await expect(fetchCatalog()).rejects.toThrow('Internal Server Error');
    });

    it('throws error on invalid JSON response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new SyntaxError('Unexpected token')),
      });

      await expect(fetchCatalog()).rejects.toThrow();
    });

    it('throws "Invalid catalog format" when version is missing', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(invalidCatalogs.missingVersion),
      });

      await expect(fetchCatalog()).rejects.toThrow('Invalid catalog format');
    });

    it('throws "Invalid catalog format" when boards is missing', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(invalidCatalogs.missingBoards),
      });

      await expect(fetchCatalog()).rejects.toThrow('Invalid catalog format');
    });

    it('throws "Invalid catalog format" when categories is missing', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(invalidCatalogs.missingCategories),
      });

      await expect(fetchCatalog()).rejects.toThrow('Invalid catalog format');
    });

    it('throws "Invalid catalog format" when boards is not an array', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(invalidCatalogs.boardsNotArray),
      });

      await expect(fetchCatalog()).rejects.toThrow('Invalid catalog format');
    });

    it('throws "Invalid catalog format" when categories is not an array', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(invalidCatalogs.categoriesNotArray),
      });

      await expect(fetchCatalog()).rejects.toThrow('Invalid catalog format');
    });
  });

  describe('localStorage errors', () => {
    it('continues without caching when localStorage.setItem throws (quota exceeded)', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(richCatalog),
      });
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await fetchCatalog();

      expect(result).toEqual(richCatalog);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('fetches fresh when localStorage.getItem throws', async () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('SecurityError');
      });
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(richCatalog),
      });
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await fetchCatalog();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(richCatalog);

      consoleErrorSpy.mockRestore();
    });
  });
});

// ============================================================================
// PART 7: CACHE UTILITY FUNCTIONS
// ============================================================================

describe('clearCatalogCache()', () => {
  const mockLocalStorage = {
    store: {} as Record<string, string>,
    getItem: vi.fn((key: string) => mockLocalStorage.store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      mockLocalStorage.store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete mockLocalStorage.store[key];
    }),
    clear: vi.fn(),
  };

  beforeEach(() => {
    mockLocalStorage.store = {};
    mockLocalStorage.removeItem.mockClear();
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  it('removes cache from localStorage when cache exists', () => {
    mockLocalStorage.store['lovewords_community_catalog_cache'] = JSON.stringify(
      createCachedCatalog(richCatalog, Date.now())
    );

    clearCatalogCache();

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('lovewords_community_catalog_cache');
  });

  it('does not throw when no cache exists', () => {
    expect(() => clearCatalogCache()).not.toThrow();
  });

  it('logs error but does not throw when localStorage.removeItem throws', () => {
    mockLocalStorage.removeItem.mockImplementation(() => {
      throw new Error('SecurityError');
    });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => clearCatalogCache()).not.toThrow();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});

describe('getCacheAge()', () => {
  const mockLocalStorage = {
    store: {} as Record<string, string>,
    getItem: vi.fn((key: string) => mockLocalStorage.store[key] || null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-24T12:00:00Z'));
    mockLocalStorage.store = {};
    mockLocalStorage.getItem.mockClear();
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns age in milliseconds for fresh cache', () => {
    const cacheTimestamp = Date.now() - 1000 * 60 * 30; // 30 minutes ago
    mockLocalStorage.store['lovewords_community_catalog_cache'] = JSON.stringify(
      createCachedCatalog(richCatalog, cacheTimestamp)
    );

    const age = getCacheAge();

    expect(age).toBeCloseTo(1000 * 60 * 30, -2); // ~30 minutes in ms
  });

  it('returns null when no cache exists', () => {
    const age = getCacheAge();

    expect(age).toBeNull();
  });

  it('returns null when cache JSON is corrupt', () => {
    mockLocalStorage.store['lovewords_community_catalog_cache'] = 'invalid json {{{';
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const age = getCacheAge();

    expect(age).toBeNull();

    consoleErrorSpy.mockRestore();
  });
});

describe('isCacheFresh()', () => {
  const mockLocalStorage = {
    store: {} as Record<string, string>,
    getItem: vi.fn((key: string) => mockLocalStorage.store[key] || null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  const CACHE_DURATION_MS = 1000 * 60 * 60; // 1 hour (matching implementation)

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-24T12:00:00Z'));
    mockLocalStorage.store = {};
    mockLocalStorage.getItem.mockClear();
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true when cache is less than 1 hour old', () => {
    const cacheTimestamp = Date.now() - 1000 * 60 * 30; // 30 minutes ago
    mockLocalStorage.store['lovewords_community_catalog_cache'] = JSON.stringify(
      createCachedCatalog(richCatalog, cacheTimestamp)
    );

    const isFresh = isCacheFresh();

    expect(isFresh).toBe(true);
  });

  it('returns false when cache is more than 1 hour old', () => {
    const cacheTimestamp = Date.now() - CACHE_DURATION_MS - 1000; // Just over 1 hour ago
    mockLocalStorage.store['lovewords_community_catalog_cache'] = JSON.stringify(
      createCachedCatalog(richCatalog, cacheTimestamp)
    );

    const isFresh = isCacheFresh();

    expect(isFresh).toBe(false);
  });

  it('returns true when cache is exactly 1 hour old', () => {
    const cacheTimestamp = Date.now() - CACHE_DURATION_MS; // Exactly 1 hour ago
    mockLocalStorage.store['lovewords_community_catalog_cache'] = JSON.stringify(
      createCachedCatalog(richCatalog, cacheTimestamp)
    );

    const isFresh = isCacheFresh();

    expect(isFresh).toBe(true);
  });

  it('returns false when no cache exists', () => {
    const isFresh = isCacheFresh();

    expect(isFresh).toBe(false);
  });
});
