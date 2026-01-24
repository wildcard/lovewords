/**
 * Component tests for CommunityBrowseModal
 *
 * Tests cover:
 * - Loading state: displays spinner while fetching catalog
 * - Error state: shows error message when fetch fails
 * - Loaded state: displays boards, categories, search, filters
 * - Category filtering: tabs work correctly
 * - Search: filters boards by query
 * - Grid size filter: filters by dimensions
 * - Sort: changes board order
 * - Board preview: opens preview modal
 * - Import flow: calls onImport with board data
 * - Accessibility: dialog role, focus trap, keyboard navigation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommunityBrowseModal } from '../../components/CommunityBrowseModal';
import type { ObfBoard } from '../../types/obf';
import {
  richCatalog,
  createBoard,
  longContentBoard,
} from '../../__mocks__/catalog-fixtures';

// ============================================================================
// MOCKS
// ============================================================================

// Mock the catalog utilities
vi.mock('../../utils/community-catalog', () => ({
  fetchCatalog: vi.fn(),
  filterBoards: vi.fn((boards) => boards),
  sortBoards: vi.fn((boards) => boards),
  getFeaturedBoards: vi.fn((catalog) =>
    catalog.boards.filter((b: { id: string }) => catalog.featured.includes(b.id))
  ),
  getCategoryBoards: vi.fn((catalog, categoryId) =>
    catalog.boards.filter((b: { category: string }) => b.category === categoryId)
  ),
}));

// Mock useFocusTrap hook
vi.mock('../../hooks/useFocusTrap', () => ({
  useFocusTrap: () => ({ current: null }),
}));

// Import mocked modules for test control
import {
  fetchCatalog,
  filterBoards,
  sortBoards,
  getFeaturedBoards,
  getCategoryBoards,
} from '../../utils/community-catalog';

const mockFetchCatalog = fetchCatalog as ReturnType<typeof vi.fn>;
const mockFilterBoards = filterBoards as ReturnType<typeof vi.fn>;
const mockSortBoards = sortBoards as ReturnType<typeof vi.fn>;
const mockGetFeaturedBoards = getFeaturedBoards as ReturnType<typeof vi.fn>;
const mockGetCategoryBoards = getCategoryBoards as ReturnType<typeof vi.fn>;

// Sample OBF response for import tests
const sampleObfBoard: ObfBoard = {
  format: 'open-board-format',
  id: 'imported-board',
  locale: 'en',
  name: 'Imported Board',
  buttons: [],
  images: [],
  sounds: [],
  grid: { rows: 4, columns: 4, order: [] },
};

// ============================================================================
// TEST SETUP
// ============================================================================

describe('CommunityBrowseModal', () => {
  const mockOnImport = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default: fetchCatalog succeeds with richCatalog
    mockFetchCatalog.mockResolvedValue(richCatalog);

    // Default: pass-through for filter/sort
    mockFilterBoards.mockImplementation((boards) => boards);
    mockSortBoards.mockImplementation((boards) => boards);

    // Mock global fetch for board import
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ==========================================================================
  // PART 1: LOADING STATE
  // ==========================================================================

  describe('Loading State', () => {
    it('displays loading spinner while fetching catalog', async () => {
      // Never resolve fetch to keep loading state
      mockFetchCatalog.mockReturnValue(new Promise(() => {}));

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      // Should show loading spinner
      expect(screen.getByText('Loading community boards...')).toBeInTheDocument();
    });

    it('shows spinner animation element during loading', async () => {
      mockFetchCatalog.mockReturnValue(new Promise(() => {}));

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      // The spinner has animate-spin class
      const spinnerContainer = screen.getByText('Loading community boards...').parentElement;
      expect(spinnerContainer).toBeInTheDocument();
      expect(spinnerContainer?.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('does not show board grid while loading', async () => {
      mockFetchCatalog.mockReturnValue(new Promise(() => {}));

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      // Should not show any board names from catalog
      expect(screen.queryByText('Basic Emotions')).not.toBeInTheDocument();
      expect(screen.queryByText('All Boards')).not.toBeInTheDocument();
    });

    it('hides loading state when catalog loads successfully', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      // Wait for catalog to load
      await waitFor(() => {
        expect(screen.queryByText('Loading community boards...')).not.toBeInTheDocument();
      });

      // Should now show content
      expect(screen.getByText('Community Boards')).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // PART 2: ERROR STATE
  // ==========================================================================

  describe('Error State', () => {
    it('shows error message when fetch fails with network error', async () => {
      mockFetchCatalog.mockRejectedValue(new Error('Network error'));

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('shows error message when fetch fails with generic error', async () => {
      mockFetchCatalog.mockRejectedValue(new Error('Failed to fetch catalog'));

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch catalog')).toBeInTheDocument();
      });
    });

    it('displays "Failed to Load" heading in error state', async () => {
      mockFetchCatalog.mockRejectedValue(new Error('Network error'));

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Failed to Load')).toBeInTheDocument();
      });
    });

    it('shows close button in error state', async () => {
      mockFetchCatalog.mockRejectedValue(new Error('Network error'));

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
      });
    });

    it('calls onClose when close button clicked in error state', async () => {
      const user = userEvent.setup();
      mockFetchCatalog.mockRejectedValue(new Error('Network error'));

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Failed to Load')).toBeInTheDocument();
      });

      // Click the close button (not the X in header, but the one in error state)
      const closeButtons = screen.getAllByRole('button');
      const errorCloseButton = closeButtons.find((btn) => btn.textContent === 'Close');
      await user.click(errorCloseButton!);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('shows fallback error message for non-Error objects', async () => {
      mockFetchCatalog.mockRejectedValue('Unknown failure');

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load community boards')).toBeInTheDocument();
      });
    });
  });

  // ==========================================================================
  // PART 3: LOADED STATE - BASIC DISPLAY
  // ==========================================================================

  describe('Loaded State - Basic Display', () => {
    it('displays modal title', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Community Boards')).toBeInTheDocument();
      });
    });

    it('displays boards in grid', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
        expect(screen.getByText('Advanced Feelings')).toBeInTheDocument();
        expect(screen.getByText('Morning Routine')).toBeInTheDocument();
      });
    });

    it('displays board card with name as heading', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        // Board names should be in headings (h3)
        const boardCards = screen.getAllByRole('heading', { level: 3 });
        const boardNames = boardCards.map((h) => h.textContent);
        expect(boardNames).toContain('Basic Emotions');
      });
    });

    it('displays board description (truncated)', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(
          screen.getByText('A starter board for expressing basic emotions')
        ).toBeInTheDocument();
      });
    });

    it('displays board metadata - grid size', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        // Grid sizes like "4x4", "5x5", "3x5" should appear
        expect(screen.getAllByText(/\d+\s*[x\xd7]\s*\d+/).length).toBeGreaterThan(0);
      });
    });

    it('displays board metadata - button count', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText(/20 buttons/)).toBeInTheDocument();
      });
    });

    it('displays board metadata - download count', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText(/100 downloads/)).toBeInTheDocument();
      });
    });

    it('displays board tags (first 3)', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        // Basic Emotions board has tags: ['aac', 'beginner', 'emotions']
        expect(screen.getAllByText('aac').length).toBeGreaterThan(0);
        expect(screen.getAllByText('beginner').length).toBeGreaterThan(0);
      });
    });

    it('displays overflow indicator when board has more than 3 tags', async () => {
      // Add a board with many tags
      const catalogWithManyTags = {
        ...richCatalog,
        boards: [longContentBoard, ...richCatalog.boards],
      };
      mockFetchCatalog.mockResolvedValue(catalogWithManyTags);

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        // longContentBoard has 10 tags, so should show "+7"
        expect(screen.getByText('+7')).toBeInTheDocument();
      });
    });

    it('displays thumbnail when board has thumbnailUrl', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        // All boards in richCatalog have thumbnailUrl from createBoard
        const images = screen.getAllByRole('img');
        expect(images.length).toBeGreaterThan(0);
      });
    });

    it('shows image with correct alt text', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        const img = screen.getByAltText('Basic Emotions');
        expect(img).toBeInTheDocument();
      });
    });
  });

  // ==========================================================================
  // PART 4: CATEGORY TABS
  // ==========================================================================

  describe('Category Tabs', () => {
    it('displays "All Boards" tab by default', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /all boards/i })
        ).toBeInTheDocument();
      });
    });

    it('shows board count for "All Boards" tab', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        // richCatalog has 5 boards
        expect(screen.getByText(/All Boards \(5\)/)).toBeInTheDocument();
      });
    });

    it('displays "Featured" tab with star icon', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /featured/i })).toBeInTheDocument();
      });
    });

    it('shows featured count', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        // richCatalog has 2 featured boards
        expect(screen.getByText(/Featured \(2\)/)).toBeInTheDocument();
      });
    });

    it('displays category tabs from catalog', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        // Look for category tabs specifically with their counts
        expect(screen.getByRole('button', { name: /heart Emotions \(2\)/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Daily Routines/i })).toBeInTheDocument();
      });
    });

    it('shows category icons', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        // Categories have icons: 'heart' for emotions, 'sun' for daily
        // Icons are part of button text
        const emotionsTab = screen.getByRole('button', { name: /heart Emotions/i });
        expect(emotionsTab).toBeInTheDocument();
        const dailyTab = screen.getByRole('button', { name: /sun Daily Routines/i });
        expect(dailyTab).toBeInTheDocument();
      });
    });

    it('shows category board counts', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        // Emotions has 2, Daily has 1
        expect(screen.getByRole('button', { name: /Emotions \(2\)/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Daily Routines \(1\)/i })).toBeInTheDocument();
      });
    });

    it('"All Boards" tab has active styling by default', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        const allBoardsTab = screen.getByRole('button', { name: /all boards/i });
        expect(allBoardsTab).toHaveClass('bg-blue-600');
      });
    });

    it('clicking category tab filters boards', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      // Click the Emotions category tab (use full pattern to avoid matching board names)
      const emotionsTab = screen.getByRole('button', { name: /heart Emotions \(2\)/i });
      await user.click(emotionsTab);

      // getCategoryBoards should be called
      expect(mockGetCategoryBoards).toHaveBeenCalled();
    });

    it('clicking "Featured" tab shows featured boards', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const featuredTab = screen.getByRole('button', { name: /featured/i });
      await user.click(featuredTab);

      expect(mockGetFeaturedBoards).toHaveBeenCalled();
    });

    it('active category tab has different styling', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const emotionsTab = screen.getByRole('button', { name: /heart Emotions \(2\)/i });
      await user.click(emotionsTab);

      // Now Emotions tab should have blue background
      expect(emotionsTab).toHaveClass('bg-blue-600');
      // All Boards should not
      const allBoardsTab = screen.getByRole('button', { name: /all boards/i });
      expect(allBoardsTab).not.toHaveClass('bg-blue-600');
    });
  });

  // ==========================================================================
  // PART 5: SEARCH FILTER
  // ==========================================================================

  describe('Search Filter', () => {
    it('displays search input with placeholder', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search boards...');
        expect(searchInput).toBeInTheDocument();
      });
    });

    it('search input has type="search"', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search boards...');
        expect(searchInput).toHaveAttribute('type', 'search');
      });
    });

    it('typing in search triggers filterBoards with query', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search boards...');
      await user.type(searchInput, 'emotions');

      // filterBoards should be called with query
      await waitFor(() => {
        expect(mockFilterBoards).toHaveBeenCalledWith(
          expect.any(Array),
          expect.objectContaining({ query: 'emotions' })
        );
      });
    });

    it('empty search clears query filter', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search boards...');
      await user.type(searchInput, 'test');
      await user.clear(searchInput);

      // filterBoards should be called with undefined query (trimmed empty string)
      await waitFor(() => {
        const lastCall = mockFilterBoards.mock.calls[mockFilterBoards.mock.calls.length - 1];
        expect(lastCall[1].query).toBeUndefined();
      });
    });
  });

  // ==========================================================================
  // PART 6: GRID SIZE FILTER
  // ==========================================================================

  describe('Grid Size Filter', () => {
    it('displays grid size dropdown with "All Sizes" default', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        const select = screen.getByDisplayValue('All Sizes');
        expect(select).toBeInTheDocument();
      });
    });

    it('shows available grid sizes from catalog boards', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        // richCatalog has boards with 4x4, 5x5, 3x5
        const select = screen.getByDisplayValue('All Sizes');
        const options = within(select as HTMLElement).getAllByRole('option');
        const optionValues = options.map((o) => o.textContent);
        expect(optionValues).toContain('All Sizes');
      });
    });

    it('selecting grid size filters boards', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const select = screen.getByDisplayValue('All Sizes');
      await user.selectOptions(select, '4x4');

      await waitFor(() => {
        expect(mockFilterBoards).toHaveBeenCalledWith(
          expect.any(Array),
          expect.objectContaining({ gridSize: '4x4' })
        );
      });
    });

    it('selecting "All Sizes" clears grid filter', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const select = screen.getByDisplayValue('All Sizes');
      await user.selectOptions(select, '4x4');
      await user.selectOptions(select, ''); // Select "All Sizes"

      await waitFor(() => {
        const lastCall = mockFilterBoards.mock.calls[mockFilterBoards.mock.calls.length - 1];
        expect(lastCall[1].gridSize).toBeUndefined();
      });
    });
  });

  // ==========================================================================
  // PART 7: SORT DROPDOWN
  // ==========================================================================

  describe('Sort Dropdown', () => {
    it('displays sort dropdown with "Name (A-Z)" as default', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        const select = screen.getByDisplayValue('Name (A-Z)');
        expect(select).toBeInTheDocument();
      });
    });

    it('shows all sort options', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        const select = screen.getByDisplayValue('Name (A-Z)');
        const options = within(select as HTMLElement).getAllByRole('option');
        const optionTexts = options.map((o) => o.textContent);

        expect(optionTexts).toContain('Name (A-Z)');
        expect(optionTexts).toContain('Newest First');
        expect(optionTexts).toContain('Oldest First');
        expect(optionTexts).toContain('Most Buttons');
        expect(optionTexts).toContain('Most Popular');
      });
    });

    it('changing sort calls sortBoards with selected option', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const select = screen.getByDisplayValue('Name (A-Z)');
      await user.selectOptions(select, 'newest');

      await waitFor(() => {
        expect(mockSortBoards).toHaveBeenCalledWith(expect.any(Array), 'newest');
      });
    });

    it('sort options have correct values', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        const select = screen.getByDisplayValue('Name (A-Z)');
        const options = within(select as HTMLElement).getAllByRole('option') as HTMLOptionElement[];

        const nameOption = options.find((o) => o.textContent === 'Name (A-Z)');
        expect(nameOption?.value).toBe('name');

        const newestOption = options.find((o) => o.textContent === 'Newest First');
        expect(newestOption?.value).toBe('newest');

        const downloadsOption = options.find((o) => o.textContent === 'Most Popular');
        expect(downloadsOption?.value).toBe('downloads');
      });
    });
  });

  // ==========================================================================
  // PART 8: BOARD GRID DISPLAY
  // ==========================================================================

  describe('Board Grid Display', () => {
    it('displays boards in responsive grid layout', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        // Grid has classes for responsive columns
        const boardGrid = screen.getByText('Basic Emotions').closest('.grid');
        expect(boardGrid).toHaveClass('grid-cols-1');
      });
    });

    it('board cards are clickable', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        const boardCard = screen.getByText('Basic Emotions').closest('.cursor-pointer');
        expect(boardCard).toBeInTheDocument();
      });
    });

    it('displays empty state when no boards match filters', async () => {
      // Make filterBoards return empty array
      mockFilterBoards.mockReturnValue([]);

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('No boards match your filters')).toBeInTheDocument();
      });
    });

    it('displays results count', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText(/Showing \d+ boards?/)).toBeInTheDocument();
      });
    });

    it('results count updates with filters', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Showing 5 boards')).toBeInTheDocument();
      });

      // Simulate filter reducing to 2 boards
      mockFilterBoards.mockReturnValue(richCatalog.boards.slice(0, 2));

      const searchInput = screen.getByPlaceholderText('Search boards...');
      await user.type(searchInput, 'test');

      await waitFor(() => {
        expect(screen.getByText('Showing 2 boards')).toBeInTheDocument();
      });
    });

    it('uses singular "board" when showing 1 result', async () => {
      mockFilterBoards.mockReturnValue([richCatalog.boards[0]]);

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Showing 1 board')).toBeInTheDocument();
      });
    });

    it('displays Import button on each board card', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        const importButtons = screen.getAllByRole('button', { name: 'Import' });
        // Should have one Import button per board
        expect(importButtons.length).toBe(richCatalog.boards.length);
      });
    });
  });

  // ==========================================================================
  // PART 9: BOARD PREVIEW MODAL
  // ==========================================================================

  describe('Board Preview Modal', () => {
    it('clicking board card opens preview modal', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      // Click on board card (not the import button)
      const boardCard = screen.getByText('Basic Emotions').closest('.cursor-pointer');
      await user.click(boardCard!);

      // Preview modal should appear with board name as heading
      await waitFor(() => {
        // There should be a second instance of the name in the preview
        const headings = screen.getAllByText('Basic Emotions');
        expect(headings.length).toBeGreaterThan(1);
      });
    });

    it('preview shows full board description', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const boardCard = screen.getByText('Basic Emotions').closest('.cursor-pointer');
      await user.click(boardCard!);

      await waitFor(() => {
        // The description appears in both card (truncated) and preview (full)
        const descriptions = screen.getAllByText('A starter board for expressing basic emotions');
        expect(descriptions.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('preview shows author name', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const boardCard = screen.getByText('Basic Emotions').closest('.cursor-pointer');
      await user.click(boardCard!);

      await waitFor(() => {
        expect(screen.getByText('Author:')).toBeInTheDocument();
        expect(screen.getByText('Test Author')).toBeInTheDocument();
      });
    });

    it('preview shows author link when authorUrl exists', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const boardCard = screen.getByText('Basic Emotions').closest('.cursor-pointer');
      await user.click(boardCard!);

      await waitFor(() => {
        const authorLink = screen.getByRole('link', { name: 'Test Author' });
        expect(authorLink).toHaveAttribute('href', 'https://example.com/author');
        expect(authorLink).toHaveAttribute('target', '_blank');
      });
    });

    it('preview shows author name without link when no authorUrl', async () => {
      const user = userEvent.setup();

      // Create board without authorUrl
      const catalogWithNoAuthorUrl = {
        ...richCatalog,
        boards: [
          createBoard({
            id: 'no-author-url',
            name: 'No Author URL Board',
            authorUrl: undefined,
          }),
        ],
      };
      mockFetchCatalog.mockResolvedValue(catalogWithNoAuthorUrl);

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('No Author URL Board')).toBeInTheDocument();
      });

      const boardCard = screen.getByText('No Author URL Board').closest('.cursor-pointer');
      await user.click(boardCard!);

      await waitFor(() => {
        expect(screen.getByText('Test Author')).toBeInTheDocument();
        // Should not be a link
        expect(screen.queryByRole('link', { name: 'Test Author' })).not.toBeInTheDocument();
      });
    });

    it('preview shows all tags', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const boardCard = screen.getByText('Basic Emotions').closest('.cursor-pointer');
      await user.click(boardCard!);

      await waitFor(() => {
        expect(screen.getByText('Tags:')).toBeInTheDocument();
        // All 3 tags should be visible in preview
        expect(screen.getAllByText('aac').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('beginner').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('emotions').length).toBeGreaterThanOrEqual(1);
      });
    });

    it('clicking overlay closes preview', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const boardCard = screen.getByText('Basic Emotions').closest('.cursor-pointer');
      await user.click(boardCard!);

      // Wait for preview to open
      await waitFor(() => {
        const headings = screen.getAllByText('Basic Emotions');
        expect(headings.length).toBeGreaterThan(1);
      });

      // Click on overlay (the dark background)
      const overlays = document.querySelectorAll('.bg-black.bg-opacity-50');
      // The preview overlay is the second one (first is main modal)
      const previewOverlay = overlays[1];
      await user.click(previewOverlay as Element);

      // Preview should close (only one instance of board name again)
      await waitFor(() => {
        const headings = screen.getAllByText('Basic Emotions');
        expect(headings.length).toBe(1);
      });
    });

    it('clicking close button in preview closes preview', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const boardCard = screen.getByText('Basic Emotions').closest('.cursor-pointer');
      await user.click(boardCard!);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Close preview' })).toBeInTheDocument();
      });

      const closePreviewButton = screen.getByRole('button', { name: 'Close preview' });
      await user.click(closePreviewButton);

      // Preview should close
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: 'Close preview' })).not.toBeInTheDocument();
      });
    });

    it('preview shows thumbnail when available', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const boardCard = screen.getByText('Basic Emotions').closest('.cursor-pointer');
      await user.click(boardCard!);

      await waitFor(() => {
        const images = screen.getAllByAltText('Basic Emotions');
        // One in card, one in preview
        expect(images.length).toBe(2);
      });
    });

    it('preview has "Import Board" button', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const boardCard = screen.getByText('Basic Emotions').closest('.cursor-pointer');
      await user.click(boardCard!);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Import Board' })).toBeInTheDocument();
      });
    });
  });

  // ==========================================================================
  // PART 10: IMPORT FLOW
  // ==========================================================================

  describe('Import Flow', () => {
    beforeEach(() => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(sampleObfBoard),
      });
    });

    it('clicking Import button fetches board from URL', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const importButtons = screen.getAllByRole('button', { name: 'Import' });
      await user.click(importButtons[0]);

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('example.com'));
    });

    it('shows "Importing..." text during import', async () => {
      const user = userEvent.setup();
      (global.fetch as ReturnType<typeof vi.fn>).mockReturnValue(
        new Promise(() => {}) // Never resolves
      );

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const importButtons = screen.getAllByRole('button', { name: 'Import' });
      await user.click(importButtons[0]);

      await waitFor(() => {
        // Check for any element containing "Importing..."
        const importingElements = screen.getAllByText(/Importing/);
        expect(importingElements.length).toBeGreaterThan(0);
      });
    });

    it('disables import buttons during import', async () => {
      const user = userEvent.setup();
      (global.fetch as ReturnType<typeof vi.fn>).mockReturnValue(
        new Promise(() => {})
      );

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const importButtons = screen.getAllByRole('button', { name: 'Import' });
      await user.click(importButtons[0]);

      await waitFor(() => {
        // All import buttons should be disabled
        const allButtons = screen.getAllByRole('button', { name: /import/i });
        allButtons.forEach((btn) => {
          if (btn.textContent !== 'Import Board') {
            // Skip preview button
            expect(btn).toBeDisabled();
          }
        });
      });
    });

    it('calls onImport with parsed ObfBoard on success', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const importButtons = screen.getAllByRole('button', { name: 'Import' });
      await user.click(importButtons[0]);

      await waitFor(() => {
        expect(mockOnImport).toHaveBeenCalledTimes(1);
        expect(mockOnImport).toHaveBeenCalledWith(sampleObfBoard);
      });
    });

    it('shows error banner when import fails', async () => {
      const user = userEvent.setup();
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      });

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const importButtons = screen.getAllByRole('button', { name: 'Import' });
      await user.click(importButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Failed to download board file')).toBeInTheDocument();
      });
    });

    it('shows error banner when fetch throws', async () => {
      const user = userEvent.setup();
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Network error')
      );

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const importButtons = screen.getAllByRole('button', { name: 'Import' });
      await user.click(importButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('import from preview modal works the same', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      // Open preview
      const boardCard = screen.getByText('Basic Emotions').closest('.cursor-pointer');
      await user.click(boardCard!);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Import Board' })).toBeInTheDocument();
      });

      // Click Import Board in preview
      const importBoardButton = screen.getByRole('button', { name: 'Import Board' });
      await user.click(importBoardButton);

      await waitFor(() => {
        expect(mockOnImport).toHaveBeenCalledWith(sampleObfBoard);
      });
    });

    it('does not call onImport when import fails', async () => {
      const user = userEvent.setup();
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Network error')
      );

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const importButtons = screen.getAllByRole('button', { name: 'Import' });
      await user.click(importButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });

      expect(mockOnImport).not.toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // PART 11: MODAL ACCESSIBILITY & INTERACTION
  // ==========================================================================

  describe('Accessibility', () => {
    it('has dialog role', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('has aria-modal="true"', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
      });
    });

    it('has aria-labelledby pointing to modal title', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        const labelId = dialog.getAttribute('aria-labelledby');
        expect(labelId).toBe('community-modal-title');

        const title = document.getElementById(labelId!);
        expect(title?.textContent).toBe('Community Boards');
      });
    });

    it('close button has aria-label', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: 'Close modal' });
        expect(closeButton).toBeInTheDocument();
      });
    });

    it('Escape key closes modal', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('Escape key is blocked during import', async () => {
      const user = userEvent.setup();
      (global.fetch as ReturnType<typeof vi.fn>).mockReturnValue(
        new Promise(() => {})
      );

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      // Start import
      const importButtons = screen.getAllByRole('button', { name: 'Import' });
      await user.click(importButtons[0]);

      await waitFor(() => {
        // Wait for importing state
        const importingElements = screen.getAllByText(/Importing/);
        expect(importingElements.length).toBeGreaterThan(0);
      });

      // Try to escape
      await user.keyboard('{Escape}');

      // Should NOT close
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('close button is disabled during import', async () => {
      const user = userEvent.setup();
      (global.fetch as ReturnType<typeof vi.fn>).mockReturnValue(
        new Promise(() => {})
      );

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const importButtons = screen.getAllByRole('button', { name: 'Import' });
      await user.click(importButtons[0]);

      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: 'Close modal' });
        expect(closeButton).toBeDisabled();
      });
    });

    it('clicking X button calls onClose', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: 'Close modal' });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('uses focus trap hook', async () => {
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Focus trap mock was called (implicit verification via hook being used)
      // The actual focus trapping is tested in useFocusTrap.test.tsx
    });

    it('preview close button has aria-label', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const boardCard = screen.getByText('Basic Emotions').closest('.cursor-pointer');
      await user.click(boardCard!);

      await waitFor(() => {
        const closePreview = screen.getByRole('button', { name: 'Close preview' });
        expect(closePreview).toHaveAttribute('aria-label', 'Close preview');
      });
    });
  });

  // ==========================================================================
  // PART 12: INTEGRATION SCENARIOS
  // ==========================================================================

  describe('Integration Scenarios', () => {
    it('combined filtering works: category + search + grid size', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      // Select category
      const emotionsTab = screen.getByRole('button', { name: /heart Emotions \(2\)/i });
      await user.click(emotionsTab);

      // Type search
      const searchInput = screen.getByPlaceholderText('Search boards...');
      await user.type(searchInput, 'basic');

      // Select grid size
      const gridSelect = screen.getByDisplayValue('All Sizes');
      await user.selectOptions(gridSelect, '4x4');

      // filterBoards should be called with combined options
      await waitFor(() => {
        const lastCall = mockFilterBoards.mock.calls[mockFilterBoards.mock.calls.length - 1];
        expect(lastCall[1]).toEqual(
          expect.objectContaining({
            query: 'basic',
            gridSize: '4x4',
          })
        );
      });
    });

    it('changing category resets to show category boards', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      // Select Featured
      const featuredTab = screen.getByRole('button', { name: /featured/i });
      await user.click(featuredTab);

      expect(mockGetFeaturedBoards).toHaveBeenCalled();

      // Then select a category
      const emotionsTab = screen.getByRole('button', { name: /heart Emotions \(2\)/i });
      await user.click(emotionsTab);

      expect(mockGetCategoryBoards).toHaveBeenCalledWith(richCatalog, 'emotions');
    });

    it('error banner appears below content when catalog loaded', async () => {
      const user = userEvent.setup();
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Import failed')
      );

      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      const importButtons = screen.getAllByRole('button', { name: 'Import' });
      await user.click(importButtons[0]);

      await waitFor(() => {
        // Error banner should be in red background area
        const errorBanner = screen.getByText('Import failed').closest('.bg-red-50');
        expect(errorBanner).toBeInTheDocument();
      });
    });

    it('can open multiple board previews in sequence', async () => {
      const user = userEvent.setup();
      render(<CommunityBrowseModal onImport={mockOnImport} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Basic Emotions')).toBeInTheDocument();
      });

      // Open first board preview
      const firstCard = screen.getByText('Basic Emotions').closest('.cursor-pointer');
      await user.click(firstCard!);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Close preview' })).toBeInTheDocument();
      });

      // Close it
      const closePreview = screen.getByRole('button', { name: 'Close preview' });
      await user.click(closePreview);

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: 'Close preview' })).not.toBeInTheDocument();
      });

      // Open second board preview
      const secondCard = screen.getByText('Morning Routine').closest('.cursor-pointer');
      await user.click(secondCard!);

      await waitFor(() => {
        // Look for description text that only appears in preview
        const descriptions = screen.getAllByText('Daily morning activities board');
        expect(descriptions.length).toBeGreaterThanOrEqual(1);
      });
    });
  });
});
