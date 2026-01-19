/**
 * BoardLibrary component - displays all available boards
 */

import { useState, useEffect } from 'react';
import type { ObfBoard } from '../types/obf';

export interface BoardLibraryProps {
  /** Callback to navigate to a board */
  onNavigateToBoard: (boardId: string) => void;
  /** Callback to edit a custom board */
  onEditBoard?: (board: ObfBoard) => void;
  /** Callback to delete a custom board */
  onDeleteBoard?: (boardId: string) => void;
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
}

function BoardItem({ board, isCustom, onNavigate, onEdit, onDelete }: BoardItemProps) {
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

        {isCustom && (onEdit || onDelete) && (
          <div className="flex gap-2 ml-4">
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
  onClose,
  loadAllBoards,
}: BoardLibraryProps) {
  const [defaultBoards, setDefaultBoards] = useState<ObfBoard[]>([]);
  const [customBoards, setCustomBoards] = useState<ObfBoard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Filter boards by search query
  const filterBoards = (boards: ObfBoard[]) => {
    if (!searchQuery.trim()) return boards;

    const query = searchQuery.toLowerCase();
    return boards.filter(board =>
      board.name.toLowerCase().includes(query) ||
      board.description?.toLowerCase().includes(query)
    );
  };

  const filteredDefaults = filterBoards(defaultBoards);
  const filteredCustom = filterBoards(customBoards);

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
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded"
              aria-label="Close board library"
              type="button"
            >
              ✕
            </button>
          </div>

          {/* Search */}
          <div className="relative">
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center text-gray-600 py-8">Loading boards...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : (
            <>
              {/* Default Boards */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Default Boards
                </h3>
                {filteredDefaults.length === 0 ? (
                  <p className="text-gray-500 text-sm">No default boards found</p>
                ) : (
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
                )}
              </section>

              {/* Custom Boards */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  My Custom Boards
                </h3>
                {filteredCustom.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    {searchQuery
                      ? 'No custom boards match your search'
                      : 'No custom boards yet. Create one to get started!'}
                  </p>
                ) : (
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
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
