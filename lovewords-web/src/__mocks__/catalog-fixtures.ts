/**
 * Test fixtures for community catalog tests
 */

import type {
  CommunityCatalog,
  CommunityBoard,
  CommunityCategory,
} from '../types/community-catalog';

/**
 * Helper to create a CommunityBoard with sensible defaults
 */
export function createBoard(overrides: Partial<CommunityBoard> = {}): CommunityBoard {
  return {
    id: 'test-board',
    name: 'Test Board',
    description: 'A test board for unit tests',
    category: 'test',
    author: 'Test Author',
    authorUrl: 'https://example.com/author',
    tags: [],
    grid: { rows: 4, columns: 4 },
    buttons: 16,
    created: '2026-01-15T00:00:00Z',
    updated: '2026-01-15T00:00:00Z',
    featured: false,
    downloads: 0,
    url: 'https://example.com/board.obf',
    thumbnailUrl: 'https://example.com/thumb.png',
    ...overrides,
  };
}

/**
 * Helper to create a CommunityCategory with defaults
 */
export function createCategory(overrides: Partial<CommunityCategory> = {}): CommunityCategory {
  return {
    id: 'test-category',
    name: 'Test Category',
    description: 'A test category',
    icon: 'test-icon',
    boardCount: 0,
    ...overrides,
  };
}

/**
 * Minimal valid catalog for basic tests
 */
export const minimalCatalog: CommunityCatalog = {
  version: '1.0',
  lastUpdated: '2026-01-20T00:00:00Z',
  categories: [],
  boards: [],
  featured: [],
};

/**
 * Rich catalog with variety for filter/sort tests
 */
export const richCatalog: CommunityCatalog = {
  version: '1.0',
  lastUpdated: '2026-01-20T00:00:00Z',
  categories: [
    createCategory({
      id: 'emotions',
      name: 'Emotions',
      description: 'Boards for expressing emotions',
      icon: 'heart',
      boardCount: 2,
    }),
    createCategory({
      id: 'daily',
      name: 'Daily Routines',
      description: 'Boards for daily activities',
      icon: 'sun',
      boardCount: 1,
    }),
    createCategory({
      id: 'empty-category',
      name: 'Empty Category',
      description: 'A category with no boards',
      icon: 'empty',
      boardCount: 0,
    }),
  ],
  boards: [
    createBoard({
      id: 'b1',
      name: 'Basic Emotions',
      description: 'A starter board for expressing basic emotions',
      category: 'emotions',
      created: '2026-01-15T00:00:00Z',
      buttons: 20,
      downloads: 100,
      tags: ['aac', 'beginner', 'emotions'],
      grid: { rows: 4, columns: 4 },
    }),
    createBoard({
      id: 'b2',
      name: 'Advanced Feelings',
      description: 'For more nuanced emotional expression',
      category: 'emotions',
      created: '2026-01-10T00:00:00Z',
      buttons: 40,
      downloads: 50,
      tags: ['aac', 'advanced'],
      grid: { rows: 5, columns: 5 },
    }),
    createBoard({
      id: 'b3',
      name: 'Morning Routine',
      description: 'Daily morning activities board',
      category: 'daily',
      created: '2026-01-20T00:00:00Z',
      buttons: 15,
      downloads: 200,
      tags: ['routine', 'beginner'],
      grid: { rows: 3, columns: 5 },
    }),
    createBoard({
      id: 'b4',
      name: 'Zebra Board',
      description: 'A board with unique name for sorting tests',
      category: 'daily',
      created: '2026-01-05T00:00:00Z',
      buttons: 15,
      downloads: 75,
      tags: ['animals'],
      grid: { rows: 4, columns: 4 },
    }),
    createBoard({
      id: 'b5',
      name: 'Alpha Board',
      description: 'First alphabetically',
      category: 'emotions',
      created: '2026-01-12T00:00:00Z',
      buttons: 15,
      downloads: 75,
      tags: ['beginner'],
      grid: { rows: 4, columns: 4 },
    }),
  ],
  featured: ['b1', 'b3'],
};

/**
 * Catalog with boards for date testing (getNewBoards)
 * These dates are relative to a test reference date of 2026-01-24
 */
export function createCatalogWithDates(referenceDate: Date): CommunityCatalog {
  const oneDayAgo = new Date(referenceDate);
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const sevenDaysAgo = new Date(referenceDate);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const exactlySevenDaysAgo = new Date(referenceDate);
  exactlySevenDaysAgo.setDate(exactlySevenDaysAgo.getDate() - 7);

  const eightDaysAgo = new Date(referenceDate);
  eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

  const futureDate = new Date(referenceDate);
  futureDate.setDate(futureDate.getDate() + 1);

  return {
    version: '1.0',
    lastUpdated: referenceDate.toISOString(),
    categories: [],
    boards: [
      createBoard({
        id: 'new-1',
        name: 'Very New Board',
        created: oneDayAgo.toISOString(),
      }),
      createBoard({
        id: 'new-7',
        name: 'Exactly 7 Days Old',
        created: exactlySevenDaysAgo.toISOString(),
      }),
      createBoard({
        id: 'old-8',
        name: 'Eight Days Old',
        created: eightDaysAgo.toISOString(),
      }),
      createBoard({
        id: 'future',
        name: 'Future Board',
        created: futureDate.toISOString(),
      }),
    ],
    featured: [],
  };
}

/**
 * Invalid catalog structures for error testing
 */
export const invalidCatalogs = {
  missingVersion: {
    lastUpdated: '2026-01-20T00:00:00Z',
    categories: [],
    boards: [],
    featured: [],
  } as unknown as CommunityCatalog,

  missingBoards: {
    version: '1.0',
    lastUpdated: '2026-01-20T00:00:00Z',
    categories: [],
    featured: [],
  } as unknown as CommunityCatalog,

  missingCategories: {
    version: '1.0',
    lastUpdated: '2026-01-20T00:00:00Z',
    boards: [],
    featured: [],
  } as unknown as CommunityCatalog,

  boardsNotArray: {
    version: '1.0',
    lastUpdated: '2026-01-20T00:00:00Z',
    categories: [],
    boards: 'not-an-array',
    featured: [],
  } as unknown as CommunityCatalog,

  categoriesNotArray: {
    version: '1.0',
    lastUpdated: '2026-01-20T00:00:00Z',
    categories: 'not-an-array',
    boards: [],
    featured: [],
  } as unknown as CommunityCatalog,
};

/**
 * Cache fixtures for localStorage testing
 */
export function createCachedCatalog(catalog: CommunityCatalog, timestamp: number) {
  return {
    data: catalog,
    timestamp,
  };
}

/**
 * Boards with same button counts for stable sort testing
 */
export const boardsWithSameButtonCount: CommunityBoard[] = [
  createBoard({ id: 'same-1', name: 'Board C', buttons: 20 }),
  createBoard({ id: 'same-2', name: 'Board A', buttons: 20 }),
  createBoard({ id: 'same-3', name: 'Board B', buttons: 20 }),
];

/**
 * Boards with unicode characters for edge case testing
 */
export const unicodeBoards: CommunityBoard[] = [
  createBoard({
    id: 'unicode-1',
    name: 'Emociones Basicas',
    description: 'Tablero con contenido en espanol y caracteres especiales: n, a, u',
    tags: ['espanol', 'emociones'],
  }),
  createBoard({
    id: 'unicode-2',
    name: 'Board with Emojis in Tags',
    tags: ['happy', 'feelings'],
  }),
];

/**
 * Board with very long name/description for truncation testing
 */
export const longContentBoard: CommunityBoard = createBoard({
  id: 'long-content',
  name: 'This is an extremely long board name that should probably be truncated in the UI because it exceeds reasonable length limits for display purposes',
  description:
    'This is an extremely long description that goes on and on and on. '.repeat(10),
  tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7', 'tag8', 'tag9', 'tag10'],
});
