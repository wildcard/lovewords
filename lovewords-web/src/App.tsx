/**
 * Main App component
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Board } from './components/Board';
import { MessageBar } from './components/MessageBar';
import { Navigation } from './components/Navigation';
import { Settings } from './components/Settings';
import { BoardNavigator } from './core/board-navigator';
import { getCellAction } from './core/cell-action';
import { getButton } from './types/obf';
import { useSpeech } from './hooks/useSpeech';
import { LocalStorageBackend, getOrCreateProfile } from './storage/local-storage';
import { DEFAULT_PROFILE } from './types/profile';
import type { Profile } from './types/profile';

export function App() {
  const [navigator, setNavigator] = useState<BoardNavigator | null>(null);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  const [, forceUpdate] = useState({});

  const storage = useRef(new LocalStorageBackend());
  const { speak, isSpeaking, voices } = useSpeech(profile.speech);

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
      const buttonId = state.currentBoard.grid.order[row]?.[col];
      if (!buttonId) return;

      const button = getButton(state.currentBoard, buttonId);
      if (!button) return;

      const action = getCellAction(button);

      switch (action.type) {
        case 'Speak':
          await speak(action.text);
          break;

        case 'Navigate':
          // Load and register the board if not already loaded
          try {
            const targetBoard = await storage.current.loadBoard(action.boardId);
            if (targetBoard) {
              navigator.registerBoard(targetBoard);
              if (navigator.navigate(action.boardId)) {
                forceUpdate({});
              }
            } else {
              console.error(`Failed to load board: ${action.boardId}`);
            }
          } catch (err) {
            console.error(`Error loading board ${action.boardId}:`, err);
          }
          break;

        case 'Back':
          if (navigator.back()) {
            forceUpdate({});
          }
          break;

        case 'Home':
          if (navigator.home()) {
            forceUpdate({});
          }
          break;

        case 'Clear':
          navigator.clearMessage();
          forceUpdate({});
          break;

        case 'Backspace':
          navigator.backspace();
          forceUpdate({});
          break;

        case 'AddWord':
          navigator.addWord(action.word);
          forceUpdate({});
          break;

        case 'Empty':
          // Do nothing
          break;
      }
    },
    [navigator, speak]
  );

  // Handle keyboard navigation
  useEffect(() => {
    if (!navigator) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const state = navigator.getState();
      const { rows, columns } = state.currentBoard.grid;

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
  }, [navigator, focusedCell, handleCellClick]);

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
      />

      <MessageBar
        message={navigator.getMessage()}
        onSpeak={handleSpeakMessage}
        onClear={handleClearMessage}
        onBackspace={handleBackspace}
        isSpeaking={isSpeaking}
      />

      <main className="flex-1 py-6">
        <Board
          board={state.currentBoard}
          onCellClick={handleCellClick}
          focusedCell={focusedCell}
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
    </div>
  );
}
