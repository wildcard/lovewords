/**
 * BoardLibrary component - displays all available boards
 */

import { useState, useEffect, useMemo } from 'react';
import type { ObfBoard } from '../types/obf';
import type { BoardFilters, BoardSort } from '../types/board-filters';
import { DEFAULT_FILTERS, DEFAULT_SORT } from '../types/board-filters';
import {
  applyFilters,
  sortBoards,
  getAvailableGridSizes,
  loadFiltersFromStorage,
  saveFiltersToStorage,
  loadSortFromStorage,
  saveSortToStorage,
} from '../utils/board-filtering';

export interface BoardLibraryProps {
  /** Callback to navigate to a board */
  onNavigateToBoard: (boardId: string) => void;
  /** Callback to edit a custom board */
  onEditBoard?: (board: ObfBoard) => void;
  /** Callback to delete a custom board */
  onDeleteBoard?: (boardId: string) => void;
  /** Callback to export a board */
  onExportBoard?: (board: ObfBoard) => void;
  /** Callback to share a board */
  onShareBoard?: (board: ObfBoard) => void;
  /** Callback to export all custom boards as ZIP */
  onExportAllBoards?: (boards: ObfBoard[]) => void;
  /** Callback to open import modal */
  onImportBoard?: () => void;
  /** Callback to browse community boards */
  onBrowseCommunity?: () => void;
  /** Callback to open template picker */
  onSelectTemplate?: () => void;
  /** Callback to open image library manager */
  onOpenImageLibrary?: () => void;
  /** Callback to close the library */
  onClose: () => void;
  /** Function to load all boards */
  loadAllBoards: () => Promise<{ defaults: ObfBoard[]; custom: ObfBoard[] }>;
}

interface BoardItemProps {
  board: ObfBoard;
  isCustom: boolean;
  onNavigate: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
  onShare?: () => void;
}

function BoardItem({ board, isCustom, onNavigate, onEdit, onDelete, onExport, onShare }: BoardItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const buttonCount = board.buttons.length;
  const createdDate = board.ext_lovewords_created_at
    ? new Date(board.ext_lovewords_created_at).toLocaleDateString()
    : 'Unknown';

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 cursor-pointer" onClick={onNavigate}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{isCustom ? '📋' : '🔒'}</span>
            <h3 className="text-lg font-semibold text-gray-900">{board.name}</h3>
          </div>

          {board.description && (
            <p className="text-sm text-gray-600 mb-2">{board.description}</p>
          )}

          <div className="flex gap-4 text-xs text-gray-500">
            <span>{buttonCount} buttons</span>
            {isCustom && <span>Created: {createdDate}</span>}
          </div>
        </div>

        {isCustom && (onEdit || onDelete || onExport || onShare) && (
          <div className="flex gap-2 ml-4">
            {onShare && (
              <button
                onClick={onShare}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                aria-label={`Share ${board.name}`}
                type="button"
              >
                🔗
              </button>
            )}
            {onExport && (
              <button
                onClick={onExport}
                className="p-2 text-green-600 hover:bg-green-50 rounded"
                aria-label={`Export ${board.name}`}
                type="button"
              >
                📤
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                aria-label={`Edit ${board.name}`}
                type="button"
              >
                ✏️
              </button>
            )}
            {onDelete && !showDeleteConfirm && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
                aria-label={`Delete ${board.name}`}
                type="button"
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>

      {showDeleteConfirm && onDelete && (
        <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
          <p className="text-sm text-red-900 mb-2">
            Delete "{board.name}"? This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onDelete();
                setShowDeleteConfirm(false);
              }}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              type="button"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function BoardLibrary({
  onNavigateToBoard,
  onEditBoard,
  onDeleteBoard,
  onExportBoard,
  onShareBoard,
  onExportAllBoards,
  onImportBoard,
  onBrowseCommunity,
  onSelectTemplate,
  onOpenImageLibrary,
  onClose,
  loadAllBoards,
}: BoardLibraryProps) {
  const [defaultBoards, setDefaultBoards] = useState<ObfBoard[]>([]);
  const [customBoards, setCustomBoards] = useState<ObfBoard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Load filters and sort from localStorage
  const [filters, setFilters] = useState<BoardFilters>(() => {
    const saved = loadFiltersFromStorage();
    return saved ? { ...DEFAULT_FILTERS, ...saved } : DEFAULT_FILTERS;
  });

  const [sort, setSort] = useState<BoardSort>(() => {
    return loadSortFromStorage() || DEFAULT_SORT;
  });

  // Load boards on mount
  useEffect(() => {
    async function loadBoards() {
      try {
        const { defaults, custom } = await loadAllBoards();
        setDefaultBoards(defaults);
        setCustomBoards(custom);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load boards:', err);
        setError('Failed to load boards');
        setLoading(false);
      }
    }

    loadBoards();
  }, [loadAllBoards]);

  // Save filters when they change
  useEffect(() => {
    saveFiltersToStorage(filters);
  }, [filters]);

  // Save sort when it changes
  useEffect(() => {
    saveSortToStorage(sort);
  }, [sort]);

  // Get available grid sizes from all boards
  const availableGridSizes = useMemo(() => {
    return getAvailableGridSizes([...defaultBoards, ...customBoards]);
  }, [defaultBoards, customBoards]);

  // Apply filters and sorting
  const filteredDefaults = useMemo(() => {
    if (!filters.showDefault) return [];
    const filtered = applyFilters(defaultBoards, filters, searchQuery);
    return sortBoards(filtered, sort);
  }, [defaultBoards, filters, searchQuery, sort]);

  const filteredCustom = useMemo(() => {
    if (!filters.showCustom) return [];
    const filtered = applyFilters(customBoards, filters, searchQuery);
    return sortBoards(filtered, sort);
  }, [customBoards, filters, searchQuery, sort]);

  const totalCount = defaultBoards.length + customBoards.length;
  const filteredCount = filteredDefaults.length + filteredCustom.length;

  // Check if any filters are active
  const hasActiveFilters =
    filters.gridSizes.length > 0 ||
    filters.dateRange !== 'all' ||
    filters.buttonCountRange !== null ||
    !filters.showDefault ||
    !filters.showCustom ||
    searchQuery.trim() !== '';

  // Clear all filters
  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-labelledby="board-library-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-300">
          <div className="flex items-center justify-between mb-4">
            <h2 id="board-library-title" className="text-2xl font-bold">
              My Boards
            </h2>
            <div className="flex items-center gap-2">
              {onExportAllBoards && customBoards.length > 0 && (
                <button
                  onClick={() => onExportAllBoards(customBoards)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                  aria-label={`Export all ${customBoards.length} custom boards`}
                  type="button"
                >
                  📦 Export All ({customBoards.length})
                </button>
              )}
              {onSelectTemplate && (
                <button
                  onClick={onSelectTemplate}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium"
                  aria-label="Start from template"
                  type="button"
                >
                  📋 Start from Template
                </button>
              )}
              {onImportBoard && (
                <button
                  onClick={onImportBoard}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  aria-label="Import board"
                  type="button"
                >
                  📥 Import Board
                </button>
              )}
              {onBrowseCommunity && (
                <button
                  onClick={onBrowseCommunity}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
                  aria-label="Browse community boards"
                  type="button"
                >
                  🌐 Browse Community
                </button>
              )}
              {onOpenImageLibrary && (
                <button
                  onClick={onOpenImageLibrary}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors text-sm font-medium"
                  aria-label="Manage image library"
                  type="button"
                >
                  🖼️ Images
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded"
                aria-label="Close board library"
                type="button"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search boards..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md"
                  aria-label="Search boards"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 border rounded-md transition-colors ${
                  showFilters
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                aria-label="Toggle filters"
                type="button"
              >
                🔽 Filters
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="p-4 bg-gray-50 rounded-md border border-gray-200 space-y-4">
                {/* Board Type Toggles */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Board Types
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.showDefault}
                        onChange={(e) =>
                          setFilters({ ...filters, showDefault: e.target.checked })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Default Boards</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.showCustom}
                        onChange={(e) =>
                          setFilters({ ...filters, showCustom: e.target.checked })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Custom Boards</span>
                    </label>
                  </div>
                </div>

                {/* Grid Size Filter */}
                {availableGridSizes.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Grid Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableGridSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            const isSelected = filters.gridSizes.includes(size);
                            setFilters({
                              ...filters,
                              gridSizes: isSelected
                                ? filters.gridSizes.filter((s) => s !== size)
                                : [...filters.gridSizes, size],
                            });
                          }}
                          className={`px-3 py-1 text-sm rounded border transition-colors ${
                            filters.gridSizes.includes(size)
                              ? 'bg-blue-100 border-blue-300 text-blue-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                          type="button"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date Range Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Created
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        dateRange: e.target.value as BoardFilters['dateRange'],
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All time</option>
                    <option value="week">Last week</option>
                    <option value="month">Last month</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 underline"
                    type="button"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Results Count and Sort */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Showing {filteredCount} of {totalCount} boards
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Sort by:</span>
                <select
                  value={`${sort.field}-${sort.order}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-') as [
                      BoardSort['field'],
                      BoardSort['order']
                    ];
                    setSort({ field, order });
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="created-desc">Newest first</option>
                  <option value="created-asc">Oldest first</option>
                  <option value="buttons-asc">Fewest buttons</option>
                  <option value="buttons-desc">Most buttons</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center text-gray-600 py-8">Loading boards...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : (
            <>
              {/* No results message */}
              {filteredDefaults.length === 0 && filteredCustom.length === 0 ? (
                <div className="text-center text-gray-600 py-8">
                  <p className="mb-2">No boards match your filters.</p>
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="text-blue-600 hover:text-blue-700 underline text-sm"
                      type="button"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Default Boards */}
                  {filters.showDefault && filteredDefaults.length > 0 && (
                    <section className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Default Boards
                      </h3>
                      <div className="grid gap-3">
                        {filteredDefaults.map((board) => (
                          <BoardItem
                            key={board.id}
                            board={board}
                            isCustom={false}
                            onNavigate={() => {
                              onNavigateToBoard(board.id);
                              onClose();
                            }}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Custom Boards */}
                  {filters.showCustom && filteredCustom.length > 0 && (
                    <section>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        My Custom Boards
                      </h3>
                      <div className="grid gap-3">
                        {filteredCustom.map((board) => (
                          <BoardItem
                            key={board.id}
                            board={board}
                            isCustom={true}
                            onNavigate={() => {
                              onNavigateToBoard(board.id);
                              onClose();
                            }}
                            onShare={
                              onShareBoard
                                ? () => {
                                    onShareBoard(board);
                                    onClose();
                                  }
                                : undefined
                            }
                            onExport={
                              onExportBoard
                                ? () => onExportBoard(board)
                                : undefined
                            }
                            onEdit={
                              onEditBoard
                                ? () => {
                                    onEditBoard(board);
                                    onClose();
                                  }
                                : undefined
                            }
                            onDelete={
                              onDeleteBoard
                                ? () => {
                                    onDeleteBoard(board.id);
                                    // Reload boards after deletion
                                    loadAllBoards().then(({ custom }) => {
                                      setCustomBoards(custom);
                                    });
                                  }
                                : undefined
                            }
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
