/**
 * Community board browsing and import modal
 */

import { useState, useEffect, useMemo } from 'react';
import type { CommunityCatalog, CommunityBoard, CommunityCategory, FilterOptions, SortOption } from '../types/community-catalog';
import type { ObfBoard } from '../types/obf';
import {
  fetchCatalog,
  filterBoards,
  sortBoards,
  getFeaturedBoards,
  getCategoryBoards,
} from '../utils/community-catalog';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface CommunityBrowseModalProps {
  /** Callback when user selects a board to import */
  onImport: (board: ObfBoard) => void;
  /** Callback to close the modal */
  onClose: () => void;
}

export function CommunityBrowseModal({ onImport, onClose }: CommunityBrowseModalProps) {
  const modalRef = useFocusTrap<HTMLDivElement>();

  // Catalog state
  const [catalog, setCatalog] = useState<CommunityCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [gridSizeFilter, setGridSizeFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('name');

  // Selected board for preview
  const [selectedBoard, setSelectedBoard] = useState<CommunityBoard | null>(null);
  const [importingBoard, setImportingBoard] = useState(false);

  // Load catalog on mount
  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCatalog();
        setCatalog(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load community boards');
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, []);

  // Filter and sort boards
  const displayedBoards = useMemo(() => {
    if (!catalog) return [];

    let boards = catalog.boards;

    // Featured filter
    if (selectedCategory === 'featured') {
      boards = getFeaturedBoards(catalog);
    }
    // Category filter
    else if (selectedCategory !== 'all') {
      boards = getCategoryBoards(catalog, selectedCategory);
    }

    // Apply search and grid size filters
    const filterOptions: FilterOptions = {
      query: searchQuery.trim() || undefined,
      category: selectedCategory !== 'all' && selectedCategory !== 'featured' ? selectedCategory : undefined,
      gridSize: gridSizeFilter || undefined,
    };

    boards = filterBoards(boards, filterOptions);

    // Apply sorting
    boards = sortBoards(boards, sortBy);

    return boards;
  }, [catalog, selectedCategory, searchQuery, gridSizeFilter, sortBy]);

  // Handle board import
  const handleImportBoard = async (board: CommunityBoard) => {
    try {
      setImportingBoard(true);
      setError(null);

      // Fetch the board OBF file from GitHub
      const response = await fetch(board.url);
      if (!response.ok) {
        throw new Error('Failed to download board file');
      }

      const obfBoard = (await response.json()) as ObfBoard;

      // Call parent's import handler
      onImport(obfBoard);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import board');
      setImportingBoard(false);
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !importingBoard) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, importingBoard]);

  // Get available grid sizes from boards
  const availableGridSizes = useMemo(() => {
    if (!catalog) return [];

    const sizes = new Set(
      catalog.boards.map((b) => `${b.grid.rows}×${b.grid.columns}`)
    );

    return Array.from(sizes).sort();
  }, [catalog]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="community-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="community-modal-title" className="text-2xl font-bold text-gray-900">
            Community Boards
          </h2>
          <button
            onClick={onClose}
            disabled={importingBoard}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading community boards...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !catalog && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Main content */}
        {!loading && catalog && (
          <>
            {/* Filters */}
            <div className="p-6 border-b border-gray-200 space-y-4">
              {/* Category tabs */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Boards ({catalog.boards.length})
                </button>
                <button
                  onClick={() => setSelectedCategory('featured')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === 'featured'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ⭐ Featured ({catalog.featured.length})
                </button>
                {catalog.categories.map((category: CommunityCategory) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.icon} {category.name} ({category.boardCount})
                  </button>
                ))}
              </div>

              {/* Search and filters row */}
              <div className="flex flex-wrap gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="search"
                    placeholder="Search boards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Grid size filter */}
                <select
                  value={gridSizeFilter}
                  onChange={(e) => setGridSizeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sizes</option>
                  {availableGridSizes.map((size) => (
                    <option key={size} value={size.replace('×', 'x')}>
                      {size}
                    </option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="buttons">Most Buttons</option>
                  <option value="downloads">Most Popular</option>
                </select>
              </div>

              {/* Results count */}
              <div className="text-sm text-gray-600">
                Showing {displayedBoards.length} board{displayedBoards.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Board grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {displayedBoards.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No boards match your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayedBoards.map((board) => (
                    <div
                      key={board.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedBoard(board)}
                    >
                      {/* Thumbnail */}
                      {board.thumbnailUrl && (
                        <img
                          src={board.thumbnailUrl}
                          alt={board.name}
                          className="w-full h-32 object-cover rounded-md mb-3"
                        />
                      )}

                      {/* Board info */}
                      <h3 className="font-semibold text-gray-900 mb-1">{board.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{board.description}</p>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                        <span>{board.grid.rows}×{board.grid.columns}</span>
                        <span>•</span>
                        <span>{board.buttons} buttons</span>
                        <span>•</span>
                        <span>{board.downloads} downloads</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {board.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {board.tags.length > 3 && (
                          <span className="px-2 py-0.5 text-gray-500 text-xs">
                            +{board.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Import button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImportBoard(board);
                        }}
                        disabled={importingBoard}
                        className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        {importingBoard ? 'Importing...' : 'Import'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Error banner */}
            {error && catalog && (
              <div className="p-4 bg-red-50 border-t border-red-200">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </>
        )}

        {/* Board preview modal */}
        {selectedBoard && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBoard(null)}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedBoard.name}</h3>
                <button
                  onClick={() => setSelectedBoard(null)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close preview"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {selectedBoard.thumbnailUrl && (
                <img
                  src={selectedBoard.thumbnailUrl}
                  alt={selectedBoard.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}

              <p className="text-gray-700 mb-4">{selectedBoard.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Grid Size:</span>{' '}
                  <span className="text-gray-600">{selectedBoard.grid.rows}×{selectedBoard.grid.columns}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Buttons:</span>{' '}
                  <span className="text-gray-600">{selectedBoard.buttons}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Author:</span>{' '}
                  {selectedBoard.authorUrl ? (
                    <a
                      href={selectedBoard.authorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedBoard.author}
                    </a>
                  ) : (
                    <span className="text-gray-600">{selectedBoard.author}</span>
                  )}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Downloads:</span>{' '}
                  <span className="text-gray-600">{selectedBoard.downloads}</span>
                </div>
              </div>

              <div className="mb-4">
                <span className="font-medium text-gray-700 text-sm">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedBoard.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleImportBoard(selectedBoard)}
                disabled={importingBoard}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {importingBoard ? 'Importing...' : 'Import Board'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
