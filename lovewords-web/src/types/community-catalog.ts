/**
 * Community catalog types for browsing and importing community boards
 */

export interface CommunityCategory {
  /** Unique category identifier */
  id: string;
  /** Display name */
  name: string;
  /** Category description */
  description: string;
  /** Emoji icon */
  icon: string;
  /** Number of boards in this category */
  boardCount: number;
}

export interface CommunityBoard {
  /** Unique board identifier */
  id: string;
  /** Board display name */
  name: string;
  /** Board description */
  description: string;
  /** Category ID this board belongs to */
  category: string;
  /** Board author name */
  author: string;
  /** Optional author URL (GitHub, website, etc.) */
  authorUrl?: string;
  /** Search/filter tags */
  tags: string[];
  /** Grid dimensions */
  grid: {
    rows: number;
    columns: number;
  };
  /** Number of buttons */
  buttons: number;
  /** Creation timestamp (ISO 8601) */
  created: string;
  /** Last updated timestamp (ISO 8601) */
  updated: string;
  /** Whether this board is featured */
  featured: boolean;
  /** Download count (for future use) */
  downloads: number;
  /** URL to .obf file */
  url: string;
  /** Optional thumbnail image URL */
  thumbnailUrl?: string;
}

export interface CommunityCatalog {
  /** Catalog format version */
  version: string;
  /** Last catalog update timestamp */
  lastUpdated: string;
  /** Available categories */
  categories: CommunityCategory[];
  /** All available boards */
  boards: CommunityBoard[];
  /** IDs of featured boards */
  featured: string[];
}

export interface FilterOptions {
  /** Search query (name, description, tags) */
  query?: string;
  /** Filter by category ID */
  category?: string;
  /** Filter by tags */
  tags?: string[];
  /** Filter by grid size (e.g., "4x4") */
  gridSize?: string;
}

export type SortOption = 'name' | 'newest' | 'oldest' | 'buttons' | 'downloads';

/**
 * Cached catalog data
 */
export interface CachedCatalog {
  data: CommunityCatalog;
  timestamp: number;
}
