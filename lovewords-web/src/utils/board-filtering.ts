/**
 * Board filtering and sorting utilities
 */

import type { ObfBoard } from '../types/obf';
import type { BoardFilters, BoardSort } from '../types/board-filters';
import { getGridSize, isWithinDateRange } from '../types/board-filters';

/**
 * Apply filters to a list of boards
 */
export function applyFilters(
  boards: ObfBoard[],
  filters: BoardFilters,
  searchQuery: string
): ObfBoard[] {
  return boards.filter(board => {
    // Search filter (name and description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        board.name.toLowerCase().includes(query) ||
        board.description?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Grid size filter
    if (filters.gridSizes.length > 0) {
      const boardGridSize = getGridSize(board.grid.rows, board.grid.columns);
      if (!filters.gridSizes.includes(boardGridSize)) return false;
    }

    // Date range filter (only for custom boards with creation date)
    if (filters.dateRange !== 'all' && board.ext_lovewords_created_at) {
      if (!isWithinDateRange(board.ext_lovewords_created_at, filters.dateRange)) {
        return false;
      }
    }

    // Button count filter
    if (filters.buttonCountRange) {
      const [min, max] = filters.buttonCountRange;
      const count = board.buttons.length;
      if (count < min || count > max) return false;
    }

    return true;
  });
}

/**
 * Sort boards by the specified field and order
 */
export function sortBoards(boards: ObfBoard[], sort: BoardSort): ObfBoard[] {
  return [...boards].sort((a, b) => {
    let comparison = 0;

    switch (sort.field) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;

      case 'created':
        const dateA = a.ext_lovewords_created_at
          ? new Date(a.ext_lovewords_created_at).getTime()
          : 0;
        const dateB = b.ext_lovewords_created_at
          ? new Date(b.ext_lovewords_created_at).getTime()
          : 0;
        comparison = dateA - dateB;
        break;

      case 'buttons':
        comparison = a.buttons.length - b.buttons.length;
        break;
    }

    return sort.order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Get all unique grid sizes from a list of boards
 */
export function getAvailableGridSizes(boards: ObfBoard[]): string[] {
  const sizes = new Set<string>();
  boards.forEach(board => {
    sizes.add(getGridSize(board.grid.rows, board.grid.columns));
  });
  return Array.from(sizes).sort();
}

/**
 * Get button count ranges for filtering
 */
export const BUTTON_COUNT_RANGES = [
  { label: 'Less than 10', value: [0, 9] as [number, number] },
  { label: '10-20 buttons', value: [10, 20] as [number, number] },
  { label: '21-30 buttons', value: [21, 30] as [number, number] },
  { label: '31+ buttons', value: [31, 999] as [number, number] },
];

/**
 * Load filters from localStorage
 */
export function loadFiltersFromStorage(): Partial<BoardFilters> | null {
  try {
    const stored = localStorage.getItem('lovewords-board-filters');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Save filters to localStorage
 */
export function saveFiltersToStorage(filters: BoardFilters): void {
  try {
    localStorage.setItem('lovewords-board-filters', JSON.stringify(filters));
  } catch (err) {
    console.error('Failed to save filters:', err);
  }
}

/**
 * Load sort preferences from localStorage
 */
export function loadSortFromStorage(): BoardSort | null {
  try {
    const stored = localStorage.getItem('lovewords-board-sort');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Save sort preferences to localStorage
 */
export function saveSortToStorage(sort: BoardSort): void {
  try {
    localStorage.setItem('lovewords-board-sort', JSON.stringify(sort));
  } catch (err) {
    console.error('Failed to save sort:', err);
  }
}
