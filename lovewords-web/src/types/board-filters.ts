/**
 * Board filtering and sorting types
 */

export interface BoardFilters {
  /** Grid sizes to show (e.g., ['4x4', '5x4']) */
  gridSizes: string[];
  /** Date range filter */
  dateRange: 'all' | 'week' | 'month';
  /** Button count range [min, max] */
  buttonCountRange: [number, number] | null;
  /** Show default boards */
  showDefault: boolean;
  /** Show custom boards */
  showCustom: boolean;
}

export type SortField = 'name' | 'created' | 'buttons';
export type SortOrder = 'asc' | 'desc';

export interface BoardSort {
  field: SortField;
  order: SortOrder;
}

/**
 * Default filter state
 */
export const DEFAULT_FILTERS: BoardFilters = {
  gridSizes: [],
  dateRange: 'all',
  buttonCountRange: null,
  showDefault: true,
  showCustom: true,
};

/**
 * Default sort state
 */
export const DEFAULT_SORT: BoardSort = {
  field: 'name',
  order: 'asc',
};

/**
 * Get grid size string from board (e.g., "4x4")
 */
export function getGridSize(rows: number, columns: number): string {
  return `${rows}x${columns}`;
}

/**
 * Check if a date is within the specified range
 */
export function isWithinDateRange(
  dateString: string | undefined,
  range: BoardFilters['dateRange']
): boolean {
  if (range === 'all') return true;
  if (!dateString) return false;

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (range === 'week') return diffDays <= 7;
  if (range === 'month') return diffDays <= 30;

  return true;
}
