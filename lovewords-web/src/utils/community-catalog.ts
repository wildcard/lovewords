/**
 * Community catalog utilities for fetching, filtering, and caching board metadata
 */

import type {
  CommunityCatalog,
  CommunityBoard,
  FilterOptions,
  SortOption,
  CachedCatalog,
} from '../types/community-catalog';

/**
 * GitHub repository configuration
 */
const GITHUB_ORG = 'wildcard';
const GITHUB_REPO = 'lovewords-boards';
const CATALOG_URL = `https://raw.githubusercontent.com/${GITHUB_ORG}/${GITHUB_REPO}/main/catalog.json`;

/**
 * Cache configuration
 */
const CACHE_KEY = 'lovewords_community_catalog_cache';
const CACHE_DURATION_MS = 1000 * 60 * 60; // 1 hour

/**
 * Fetch the community catalog from GitHub
 * Uses cached version if available and fresh
 */
export async function fetchCatalog(forceRefresh = false): Promise<CommunityCatalog> {
  // Check cache first unless force refresh
  if (!forceRefresh) {
    const cached = getCachedCatalog();
    if (cached) {
      return cached.data;
    }
  }

  try {
    const response = await fetch(CATALOG_URL, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch catalog: ${response.statusText}`);
    }

    const catalog = (await response.json()) as CommunityCatalog;

    // Validate basic structure
    if (!catalog.version || !Array.isArray(catalog.boards) || !Array.isArray(catalog.categories)) {
      throw new Error('Invalid catalog format');
    }

    // Cache the result
    saveCatalogToCache(catalog);

    return catalog;
  } catch (error) {
    // Try to return stale cache on error
    const cached = getCachedCatalog(true);
    if (cached) {
      console.warn('Using stale catalog cache due to fetch error:', error);
      return cached.data;
    }

    throw error;
  }
}

/**
 * Filter boards based on filter options
 */
export function filterBoards(
  boards: CommunityBoard[],
  options: FilterOptions
): CommunityBoard[] {
  return boards.filter((board) => {
    // Search query filter
    if (options.query) {
      const query = options.query.toLowerCase();
      const matchesQuery =
        board.name.toLowerCase().includes(query) ||
        board.description.toLowerCase().includes(query) ||
        board.tags.some((tag) => tag.toLowerCase().includes(query));

      if (!matchesQuery) return false;
    }

    // Category filter
    if (options.category && board.category !== options.category) {
      return false;
    }

    // Tags filter (board must have ALL specified tags)
    if (options.tags && options.tags.length > 0) {
      const hasAllTags = options.tags.every((tag) =>
        board.tags.some((boardTag) => boardTag.toLowerCase() === tag.toLowerCase())
      );
      if (!hasAllTags) return false;
    }

    // Grid size filter
    if (options.gridSize) {
      const [rows, cols] = options.gridSize.split('x').map(Number);
      if (board.grid.rows !== rows || board.grid.columns !== cols) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort boards by specified criteria
 */
export function sortBoards(boards: CommunityBoard[], sortBy: SortOption): CommunityBoard[] {
  const sorted = [...boards];

  switch (sortBy) {
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case 'newest':
      sorted.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
      break;

    case 'oldest':
      sorted.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
      break;

    case 'buttons':
      sorted.sort((a, b) => b.buttons - a.buttons);
      break;

    case 'downloads':
      sorted.sort((a, b) => b.downloads - a.downloads);
      break;

    default:
      // No sorting or unknown sort option
      break;
  }

  return sorted;
}

/**
 * Get all boards in a specific category
 */
export function getCategoryBoards(
  catalog: CommunityCatalog,
  categoryId: string
): CommunityBoard[] {
  return catalog.boards.filter((board) => board.category === categoryId);
}

/**
 * Get featured boards
 */
export function getFeaturedBoards(catalog: CommunityCatalog): CommunityBoard[] {
  return catalog.boards.filter((board) => catalog.featured.includes(board.id));
}

/**
 * Get boards created within the last N days
 */
export function getNewBoards(catalog: CommunityCatalog, days: number): CommunityBoard[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return catalog.boards.filter((board) => {
    const createdDate = new Date(board.created);
    return createdDate >= cutoffDate;
  });
}

/**
 * Get cached catalog if available and fresh
 * @param allowStale - If true, return even if cache is expired
 */
function getCachedCatalog(allowStale = false): CachedCatalog | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached) as CachedCatalog;

    // Check if cache is still fresh
    const age = Date.now() - parsed.timestamp;
    if (!allowStale && age > CACHE_DURATION_MS) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Failed to read catalog cache:', error);
    return null;
  }
}

/**
 * Save catalog to localStorage cache
 */
function saveCatalogToCache(catalog: CommunityCatalog): void {
  try {
    const cached: CachedCatalog = {
      data: catalog,
      timestamp: Date.now(),
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch (error) {
    console.error('Failed to cache catalog:', error);
    // Non-fatal - continue without caching
  }
}

/**
 * Clear the catalog cache
 * Useful for debugging or when manual refresh is needed
 */
export function clearCatalogCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error('Failed to clear catalog cache:', error);
  }
}

/**
 * Get the age of the cached catalog in milliseconds
 * Returns null if no cache exists
 */
export function getCacheAge(): number | null {
  const cached = getCachedCatalog(true);
  if (!cached) return null;

  return Date.now() - cached.timestamp;
}

/**
 * Check if the cache is fresh (not expired)
 */
export function isCacheFresh(): boolean {
  const age = getCacheAge();
  if (age === null) return false;

  return age <= CACHE_DURATION_MS;
}
