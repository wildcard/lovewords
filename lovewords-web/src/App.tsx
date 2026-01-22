/**
 * Main App component
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Board } from './components/Board';
import { MessageBar } from './components/MessageBar';
import { Navigation } from './components/Navigation';
import { Settings } from './components/Settings';
import { BoardCreator } from './components/BoardCreator';
import { ButtonEditor } from './components/ButtonEditor';
import { BoardLibrary } from './components/BoardLibrary';
import { ImportModal } from './components/ImportModal';
import { ShareModal } from './components/ShareModal';
import { DragOverlay } from './components/DragOverlay';
import { ScreenReaderAnnouncer } from './components/ScreenReaderAnnouncer';
import { BoardNavigator } from './core/board-navigator';
import { getCellAction } from './core/cell-action';
import { getButton } from './types/obf';
import type { ObfBoard, ObfButton } from './types/obf';
import { useSpeech } from './hooks/useSpeech';
import { useAnnouncer } from './hooks/useAnnouncer';
import { useScanner } from './hooks/useScanner';
import { useDragDrop } from './hooks/useDragDrop';
import { LocalStorageBackend, getOrCreateProfile, StorageQuotaError } from './storage/local-storage';
import { DEFAULT_PROFILE } from './types/profile';
import type { Profile } from './types/profile';
import { downloadBoard, exportAllBoards } from './utils/board-export';

export function App() {
  const [navigator, setNavigator] = useState<BoardNavigator | null>(null);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showBoardCreator, setShowBoardCreator] = useState(false);
  const [showBoardLibrary, setShowBoardLibrary] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [boardToShare, setBoardToShare] = useState<ObfBoard | null>(null);
  const [existingBoardIds, setExistingBoardIds] = useState<string[]>([]);
  const [pendingImportFiles, setPendingImportFiles] = useState<File[]>([]);
  const [editingBoard, setEditingBoard] = useState<ObfBoard | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  const [, forceUpdate] = useState({});

  const storage = useRef(new LocalStorageBackend());
  const { speak, isSpeaking, voices } = useSpeech(profile.speech);
  const { announcement, announce } = useAnnouncer();

  // Drag-and-drop file import
  const handleFileDrop = useCallback(async (files: File[]) => {
    announce(`Importing ${files.length} board${files.length > 1 ? 's' : ''}...`);

    // Store files for processing
    setPendingImportFiles(files);

    // Load existing board IDs for collision detection
    const defaultIds = ['love-and-affection', 'core-words', 'basic-needs'];
    const customBoards = await storage.current.listCustomBoards();
    const customIds = customBoards.map(b => b.id);
    setExistingBoardIds([...defaultIds, ...customIds]);

    // Open import modal
    setShowImportModal(true);
  }, [announce]);

  const { isDragging } = useDragDrop({
    onDrop: handleFileDrop,
    accept: ['.obf', '.json'],
    enabled: !showImportModal && !showShareModal && !showSettings && !showBoardCreator && !showBoardLibrary,
  });

  // Stable callback reference for useScanner (avoids circular dependency)
  const handleCellClickRef = useRef<(row: number, col: number) => void>(() => {});

  // Switch scanning (initialized with default board, updated in effect)
  const { scanState, selectCell } = useScanner(
    navigator?.getState().currentBoard || { grid: { rows: 1, columns: 1, order: [[null]] } } as any,
    profile.scanning || DEFAULT_PROFILE.scanning!,
    (row, col) => handleCellClickRef.current(row, col)
  );

  // Load initial data
  useEffect(() => {
    async function loadInitialData() {
      try {
        // Load profile
        const loadedProfile = await getOrCreateProfile(storage.current);
        setProfile(loadedProfile);

        // Load home board
        const homeBoard = await storage.current.loadBoard('love-and-affection');
        if (!homeBoard) {
          throw new Error('Failed to load home board');
        }

        // Initialize navigator
        const nav = new BoardNavigator(homeBoard);
        setNavigator(nav);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load initial data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load application');
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Handle cell click
  const handleCellClick = useCallback(
    async (row: number, col: number) => {
      if (!navigator) return;

      const state = navigator.getState();

      // In edit mode, open ButtonEditor instead of performing action
      if (isEditMode) {
        setEditingCell({ row, col });
        return;
      }

      const buttonId = state.currentBoard.grid.order[row]?.[col];
      if (!buttonId) return;

      const button = getButton(state.currentBoard, buttonId);
      if (!button) return;

      const action = getCellAction(button);

      switch (action.type) {
        case 'Speak':
          announce(`Speaking: ${action.text}`);
          await speak(action.text);
          break;

        case 'Navigate':
          // Load and register the board if not already loaded
          try {
            const targetBoard = await storage.current.loadBoard(action.boardId);
            if (targetBoard) {
              navigator.registerBoard(targetBoard);
              if (navigator.navigate(action.boardId)) {
                announce(`Navigated to ${targetBoard.name} board`);
                forceUpdate({});
              }
            } else {
              console.error(`Failed to load board: ${action.boardId}`);
              announce(`Failed to load board: ${action.boardId}`, 'assertive');
            }
          } catch (err) {
            console.error(`Error loading board ${action.boardId}:`, err);
            announce(`Error loading board`, 'assertive');
          }
          break;

        case 'Back':
          if (navigator.back()) {
            const state = navigator.getState();
            announce(`Navigated back to ${state.currentBoard.name}`);
            forceUpdate({});
          }
          break;

        case 'Home':
          if (navigator.home()) {
            announce('Navigated to home board');
            forceUpdate({});
          }
          break;

        case 'Clear':
          navigator.clearMessage();
          announce('Message cleared');
          forceUpdate({});
          break;

        case 'Backspace':
          navigator.backspace();
          announce('Removed last word');
          forceUpdate({});
          break;

        case 'AddWord':
          navigator.addWord(action.word);
          announce(`Added ${action.word} to message`);
          forceUpdate({});
          break;

        case 'Empty':
          // Do nothing
          break;
      }
    },
    [navigator, speak, announce, isEditMode]
  );

  // Update the ref when handleCellClick changes
  useEffect(() => {
    handleCellClickRef.current = handleCellClick;
  }, [handleCellClick]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!navigator) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const state = navigator.getState();
      const { rows, columns } = state.currentBoard.grid;

      // When scanning is active, Space/Enter select the highlighted cell
      if (scanState.isScanning && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        selectCell();
        return;
      }

      // Normal keyboard navigation (disabled when scanning)
      if (scanState.isScanning) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setFocusedCell((prev) => ({
            ...prev,
            row: Math.max(0, prev.row - 1),
          }));
          break;

        case 'ArrowDown':
          e.preventDefault();
          setFocusedCell((prev) => ({
            ...prev,
            row: Math.min(rows - 1, prev.row + 1),
          }));
          break;

        case 'ArrowLeft':
          e.preventDefault();
          setFocusedCell((prev) => ({
            ...prev,
            col: Math.max(0, prev.col - 1),
          }));
          break;

        case 'ArrowRight':
          e.preventDefault();
          setFocusedCell((prev) => ({
            ...prev,
            col: Math.min(columns - 1, prev.col + 1),
          }));
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          handleCellClick(focusedCell.row, focusedCell.col);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigator, focusedCell, handleCellClick, scanState.isScanning, selectCell]);

  // Handle screen tap as switch when scanning is active
  useEffect(() => {
    if (!scanState.isScanning) return;

    const handleGlobalClick = (e: MouseEvent) => {
      // Only intercept clicks when scanning (allow Settings button, etc. to work)
      const target = e.target as HTMLElement;
      if (target.closest('.nav-button') || target.closest('[role="dialog"]')) {
        return; // Don't intercept navigation or modal clicks
      }

      e.preventDefault();
      e.stopPropagation();
      selectCell();
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () => document.removeEventListener('click', handleGlobalClick, { capture: true });
  }, [scanState.isScanning, selectCell]);

  // Message bar handlers
  const handleSpeakMessage = useCallback(() => {
    if (!navigator) return;
    const message = navigator.getMessage();
    if (message.trim()) {
      speak(message);
    }
  }, [navigator, speak]);

  const handleClearMessage = useCallback(() => {
    if (!navigator) return;
    navigator.clearMessage();
    forceUpdate({});
  }, [navigator]);

  const handleBackspace = useCallback(() => {
    if (!navigator) return;
    navigator.backspace();
    forceUpdate({});
  }, [navigator]);

  // Navigation handlers
  const handleBack = useCallback(() => {
    if (!navigator) return;
    if (navigator.back()) {
      forceUpdate({});
      setFocusedCell({ row: 0, col: 0 });
    }
  }, [navigator]);

  const handleHome = useCallback(() => {
    if (!navigator) return;
    if (navigator.home()) {
      forceUpdate({});
      setFocusedCell({ row: 0, col: 0 });
    }
  }, [navigator]);

  // Settings handlers
  const handleProfileChange = useCallback(async (newProfile: Profile) => {
    setProfile(newProfile);
    await storage.current.saveProfile(newProfile);
  }, []);

  const handleTestSpeech = useCallback(() => {
    speak("I love you! This is a test of the speech settings.");
  }, [speak]);

  // Board creation/editing handlers
  const handleSaveBoard = useCallback(async (board: ObfBoard) => {
    try {
      const isEditing = !!editingBoard;
      await storage.current.saveBoard(board);
      announce(`Board "${board.name}" ${isEditing ? 'updated' : 'created'} successfully`);
      setShowBoardCreator(false);
      setEditingBoard(null);

      // Register board with navigator and navigate to it
      if (navigator) {
        navigator.registerBoard(board);
        if (navigator.navigate(board.id)) {
          forceUpdate({});
        }
      }
    } catch (error) {
      console.error('Failed to save board:', error);
      if (error instanceof StorageQuotaError) {
        announce(error.message, 'assertive');
      } else {
        announce('Failed to save board', 'assertive');
      }
    }
  }, [navigator, announce, editingBoard]);

  // Board library handlers
  const loadAllBoards = useCallback(async () => {
    // Load default boards
    const defaultBoardIds = ['love-and-affection', 'core-words', 'basic-needs'];
    const defaultPromises = defaultBoardIds.map(id => storage.current.loadBoard(id));
    const defaults = (await Promise.all(defaultPromises)).filter((b): b is ObfBoard => b !== null);

    // Load custom boards
    const custom = await storage.current.listCustomBoards();

    return { defaults, custom };
  }, []);

  const handleNavigateToBoard = useCallback(async (boardId: string) => {
    if (!navigator) return;

    try {
      const board = await storage.current.loadBoard(boardId);
      if (board) {
        navigator.registerBoard(board);
        if (navigator.navigate(boardId)) {
          announce(`Navigated to ${board.name}`);
          forceUpdate({});
        }
      }
    } catch (error) {
      console.error('Failed to load board:', error);
      announce('Failed to load board', 'assertive');
    }
  }, [navigator, announce]);

  const handleEditBoardMetadata = useCallback((board: ObfBoard) => {
    setEditingBoard(board);
    setShowBoardCreator(true);
  }, []);

  const handleDeleteBoard = useCallback(async (boardId: string) => {
    try {
      await storage.current.deleteBoard(boardId);
      announce('Board deleted successfully');

      // If we deleted the current board, navigate home
      if (navigator && navigator.getState().currentBoard.id === boardId) {
        navigator.home();
        forceUpdate({});
      }
    } catch (error) {
      console.error('Failed to delete board:', error);
      announce('Failed to delete board', 'assertive');
    }
  }, [navigator, announce]);

  const handleExportBoard = useCallback((board: ObfBoard) => {
    downloadBoard(board);
    announce(`Exported ${board.name}`);
  }, [announce]);

  const handleExportAllBoards = useCallback(async (boards: ObfBoard[]) => {
    try {
      announce(`Exporting ${boards.length} boards...`);

      await exportAllBoards(boards, (progress) => {
        // Progress updates (0-100)
        if (progress === 100) {
          announce(`Exported ${boards.length} boards successfully`);
        }
      });
    } catch (error) {
      console.error('Failed to export all boards:', error);
      announce('Failed to export boards', 'assertive');
    }
  }, [announce]);

  const handleShareBoard = useCallback((board: ObfBoard) => {
    setBoardToShare(board);
    setShowShareModal(true);
  }, []);

  const handleOpenImportModal = useCallback(async () => {
    // Load existing board IDs
    const defaultIds = ['love-and-affection', 'core-words', 'basic-needs'];
    const customBoards = await storage.current.listCustomBoards();
    const customIds = customBoards.map(b => b.id);
    setExistingBoardIds([...defaultIds, ...customIds]);
    setShowImportModal(true);
  }, []);

  const handleImportBoard = useCallback(async (board: ObfBoard) => {
    try {
      await storage.current.saveBoard(board);
      announce(`Imported ${board.name}`);
      setShowImportModal(false);

      // Register board with navigator and navigate to it
      if (navigator) {
        navigator.registerBoard(board);
        if (navigator.navigate(board.id)) {
          forceUpdate({});
        }
      }
    } catch (error) {
      console.error('Failed to import board:', error);
      if (error instanceof StorageQuotaError) {
        announce(error.message, 'assertive');
      } else {
        announce('Failed to import board', 'assertive');
      }
    }
  }, [navigator, announce]);

  // Button editing handlers
  const handleSaveButton = useCallback(async (button: ObfButton, row: number, col: number, imageDataUrl?: string) => {
    if (!navigator) return;

    try {
      const state = navigator.getState();
      const currentBoard = state.currentBoard;

      // Check if this is a custom board (only custom boards can be edited)
      if (!currentBoard.ext_lovewords_custom) {
        announce('Only custom boards can be edited', 'assertive');
        return;
      }

      // Clone the board to avoid mutation
      const updatedBoard: ObfBoard = {
        ...currentBoard,
        buttons: [...currentBoard.buttons],
        images: [...currentBoard.images],
        grid: {
          ...currentBoard.grid,
          order: currentBoard.grid.order.map(row => [...row]),
        },
        ext_lovewords_updated_at: new Date().toISOString(),
      };

      // Handle image if provided
      if (imageDataUrl && button.image_id) {
        // Check if image already exists
        const existingImageIndex = updatedBoard.images.findIndex(img => img.id === button.image_id);

        if (existingImageIndex >= 0) {
          // Update existing image
          updatedBoard.images[existingImageIndex] = {
            id: button.image_id,
            data: imageDataUrl,
            content_type: 'image/jpeg',
            width: 200,
            height: 200,
          };
        } else {
          // Add new image
          updatedBoard.images.push({
            id: button.image_id,
            data: imageDataUrl,
            content_type: 'image/jpeg',
            width: 200,
            height: 200,
          });
        }
      }

      // Check if button already exists in buttons array
      const existingIndex = updatedBoard.buttons.findIndex(b => b.id === button.id);
      if (existingIndex >= 0) {
        // Update existing button
        updatedBoard.buttons[existingIndex] = button;
      } else {
        // Add new button
        updatedBoard.buttons.push(button);
      }

      // Update grid order to reference this button
      updatedBoard.grid.order[row][col] = button.id;

      // Save to localStorage
      await storage.current.saveBoard(updatedBoard);

      // Update navigator
      navigator.registerBoard(updatedBoard);
      forceUpdate({});

      setEditingCell(null);
      announce('Button saved successfully');
    } catch (error) {
      console.error('Failed to save button:', error);
      if (error instanceof StorageQuotaError) {
        announce(error.message, 'assertive');
      } else {
        announce('Failed to save button', 'assertive');
      }
    }
  }, [navigator, announce]);

  const handleDeleteButton = useCallback(async (buttonId: string, row: number, col: number) => {
    if (!navigator) return;

    try {
      const state = navigator.getState();
      const currentBoard = state.currentBoard;

      // Check if this is a custom board
      if (!currentBoard.ext_lovewords_custom) {
        announce('Only custom boards can be edited', 'assertive');
        return;
      }

      // Clone the board
      const updatedBoard: ObfBoard = {
        ...currentBoard,
        buttons: currentBoard.buttons.filter(b => b.id !== buttonId),
        grid: {
          ...currentBoard.grid,
          order: currentBoard.grid.order.map(row => [...row]),
        },
        ext_lovewords_updated_at: new Date().toISOString(),
      };

      // Remove from grid
      updatedBoard.grid.order[row][col] = null;

      // Save to localStorage
      await storage.current.saveBoard(updatedBoard);

      // Update navigator
      navigator.registerBoard(updatedBoard);
      forceUpdate({});

      setEditingCell(null);
      announce('Button deleted successfully');
    } catch (error) {
      console.error('Failed to delete button:', error);
      announce('Failed to delete button', 'assertive');
    }
  }, [navigator, announce]);

  const handleReorder = useCallback(async (newOrder: (string | null)[][]) => {
    if (!navigator) return;

    try {
      const state = navigator.getState();
      const currentBoard = state.currentBoard;

      // Check if this is a custom board (only custom boards can be edited)
      if (!currentBoard.ext_lovewords_custom) {
        announce('Only custom boards can be edited', 'assertive');
        return;
      }

      // Clone the board to avoid mutation
      const updatedBoard: ObfBoard = {
        ...currentBoard,
        buttons: [...currentBoard.buttons],
        images: [...currentBoard.images],
        grid: {
          ...currentBoard.grid,
          order: newOrder,
        },
        ext_lovewords_updated_at: new Date().toISOString(),
      };

      // Save to localStorage
      await storage.current.saveBoard(updatedBoard);

      // Update navigator
      navigator.registerBoard(updatedBoard);
      forceUpdate({});

      announce('Button positions updated');
    } catch (error) {
      console.error('Failed to reorder buttons:', error);
      announce('Failed to reorder buttons', 'assertive');
    }
  }, [navigator, announce]);

  // Render loading/error states
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading LoveWords...</div>
      </div>
    );
  }

  if (error || !navigator) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error || 'Failed to initialize'}</div>
      </div>
    );
  }

  const state = navigator.getState();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Drag-and-drop overlay */}
      <DragOverlay visible={isDragging} />

      {/* Skip to main content link for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to communication board
      </a>

      {/* Screen reader announcements */}
      <ScreenReaderAnnouncer announcement={announcement} />

      <header className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 px-6">
        <h1 className="text-3xl font-bold">LoveWords</h1>
        <p className="text-sm opacity-90">Express yourself with love</p>
      </header>

      <Navigation
        breadcrumbs={navigator.getBreadcrumbs()}
        canGoBack={navigator.canGoBack()}
        onBack={handleBack}
        onHome={handleHome}
        onSettings={() => setShowSettings(true)}
        onCreateBoard={() => {
          setEditingBoard(null);
          setShowBoardCreator(true);
        }}
        onOpenBoardLibrary={() => setShowBoardLibrary(true)}
        isCustomBoard={!!state.currentBoard.ext_lovewords_custom}
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
      />

      <MessageBar
        message={navigator.getMessage()}
        onSpeak={handleSpeakMessage}
        onClear={handleClearMessage}
        onBackspace={handleBackspace}
        isSpeaking={isSpeaking}
      />

      <main id="main-content" className="flex-1 py-6" tabIndex={-1}>
        <Board
          board={state.currentBoard}
          onCellClick={handleCellClick}
          focusedCell={focusedCell}
          scanHighlightedCell={scanState.highlightedCell}
          isEditMode={isEditMode}
          onReorder={handleReorder}
        />
      </main>

      <footer className="bg-gray-100 py-3 px-6 text-center text-sm text-gray-600">
        <p>
          Board: <strong>{state.currentBoard.name}</strong>
        </p>
      </footer>

      {/* Settings modal */}
      {showSettings && (
        <Settings
          profile={profile}
          voices={voices}
          onChange={handleProfileChange}
          onClose={() => setShowSettings(false)}
          onTestSpeech={handleTestSpeech}
        />
      )}

      {/* Board creator modal */}
      {showBoardCreator && (
        <BoardCreator
          board={editingBoard || undefined}
          onSave={handleSaveBoard}
          onClose={() => {
            setShowBoardCreator(false);
            setEditingBoard(null);
          }}
        />
      )}

      {/* Button editor modal */}
      {editingCell && (
        <ButtonEditor
          board={state.currentBoard}
          row={editingCell.row}
          col={editingCell.col}
          button={
            state.currentBoard.grid.order[editingCell.row]?.[editingCell.col]
              ? getButton(
                  state.currentBoard,
                  state.currentBoard.grid.order[editingCell.row][editingCell.col]!
                )
              : undefined
          }
          onSave={handleSaveButton}
          onClose={() => setEditingCell(null)}
          onDelete={handleDeleteButton}
        />
      )}

      {/* Board library modal */}
      {showBoardLibrary && (
        <BoardLibrary
          onNavigateToBoard={handleNavigateToBoard}
          onEditBoard={handleEditBoardMetadata}
          onDeleteBoard={handleDeleteBoard}
          onExportBoard={handleExportBoard}
          onShareBoard={handleShareBoard}
          onExportAllBoards={handleExportAllBoards}
          onImportBoard={handleOpenImportModal}
          onClose={() => setShowBoardLibrary(false)}
          loadAllBoards={loadAllBoards}
        />
      )}

      {/* Import modal */}
      {showImportModal && (
        <ImportModal
          onImport={handleImportBoard}
          onClose={() => {
            setShowImportModal(false);
            setPendingImportFiles([]);
          }}
          existingBoardIds={existingBoardIds}
          pendingFiles={pendingImportFiles.length > 0 ? pendingImportFiles : undefined}
        />
      )}

      {/* Share modal */}
      {showShareModal && boardToShare && (
        <ShareModal
          board={boardToShare}
          onClose={() => {
            setShowShareModal(false);
            setBoardToShare(null);
          }}
        />
      )}
    </div>
  );
}
