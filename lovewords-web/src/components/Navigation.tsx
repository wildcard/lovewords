/**
 * Navigation component - back/home buttons and breadcrumbs
 */

export interface NavigationProps {
  /** Breadcrumb trail of board names */
  breadcrumbs: string[];
  /** Whether back button is enabled */
  canGoBack: boolean;
  /** Callback for back button */
  onBack: () => void;
  /** Callback for home button */
  onHome: () => void;
  /** Callback for settings button */
  onSettings?: () => void;
  /** Callback for create board button */
  onCreateBoard?: () => void;
  /** Callback to open board library */
  onOpenBoardLibrary?: () => void;
  /** Whether current board is a custom board */
  isCustomBoard?: boolean;
  /** Whether edit mode is active */
  isEditMode?: boolean;
  /** Callback to toggle edit mode */
  onToggleEditMode?: () => void;
}

export function Navigation({
  breadcrumbs,
  canGoBack,
  onBack,
  onHome,
  onSettings,
  onCreateBoard,
  onOpenBoardLibrary,
  isCustomBoard,
  isEditMode,
  onToggleEditMode,
}: NavigationProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-300">
      <div className="flex items-center gap-2">
        <button
          className="nav-button disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onBack}
          disabled={!canGoBack}
          aria-label="Go back to previous board"
          type="button"
        >
          ← Back
        </button>

        <button
          className="nav-button disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onHome}
          disabled={!canGoBack}
          aria-label="Go to home board"
          type="button"
        >
          🏠 Home
        </button>
      </div>

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex-1 mx-4">
        <ol className="flex items-center gap-2 text-sm text-gray-600">
          {breadcrumbs.map((name, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-gray-400">›</span>}
              <span className={index === breadcrumbs.length - 1 ? 'font-semibold text-gray-900' : ''}>
                {name}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="flex items-center gap-2">
        {isCustomBoard && onToggleEditMode && (
          <button
            className={`nav-button ${isEditMode ? 'bg-blue-600 text-white' : ''}`}
            onClick={onToggleEditMode}
            aria-label={isEditMode ? 'Exit edit mode' : 'Edit board'}
            type="button"
          >
            {isEditMode ? '✓ Done Editing' : '✏️ Edit Board'}
          </button>
        )}

        {onOpenBoardLibrary && (
          <button
            className="nav-button"
            onClick={onOpenBoardLibrary}
            aria-label="View all boards"
            type="button"
          >
            📚 My Boards
          </button>
        )}

        {onCreateBoard && (
          <button
            className="nav-button"
            onClick={onCreateBoard}
            aria-label="Create new board"
            type="button"
          >
            ➕ Create Board
          </button>
        )}

        {onSettings && (
          <button
            className="nav-button"
            onClick={onSettings}
            aria-label="Open settings"
            type="button"
          >
            ⚙️ Settings
          </button>
        )}
      </div>
    </div>
  );
}
