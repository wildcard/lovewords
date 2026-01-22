/**
 * ImportModal component - Import boards from files or URLs
 */

import { useState, useRef, useEffect } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import type { ObfBoard } from '../types/obf';
import { importFromFile, importFromUrl, hasIdCollision, processImportedBoard } from '../utils/board-import';

export interface ImportModalProps {
  /** Callback when board is successfully imported */
  onImport: (board: ObfBoard) => void;
  /** Callback to close modal */
  onClose: () => void;
  /** Existing board IDs for collision detection */
  existingBoardIds: string[];
  /** Optional files to import (from drag-and-drop) */
  pendingFiles?: File[];
}

type ImportMode = 'file' | 'url';
type CollisionStrategy = 'rename' | 'replace';

export function ImportModal({ onImport, onClose, existingBoardIds, pendingFiles }: ImportModalProps) {
  const [mode, setMode] = useState<ImportMode>('file');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importedBoard, setImportedBoard] = useState<ObfBoard | null>(null);
  const [collisionStrategy, setCollisionStrategy] = useState<CollisionStrategy>('rename');
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const dialogRef = useFocusTrap<HTMLDivElement>({ active: true, onEscape: onClose });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Auto-load first pending file from drag-and-drop
  useEffect(() => {
    if (pendingFiles && pendingFiles.length > 0 && currentFileIndex < pendingFiles.length && !importedBoard && !loading) {
      const file = pendingFiles[currentFileIndex];
      handleFileSelect({ target: { files: [file] } } as any);
    }
  }, [pendingFiles, currentFileIndex, importedBoard, loading]);

  const hasCollision = importedBoard ? hasIdCollision(importedBoard.id, existingBoardIds) : false;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const result = await importFromFile(file);

    if (result.success && result.board) {
      setImportedBoard(result.board);
    } else {
      setError(result.error || 'Failed to import file');
      setImportedBoard(null);
    }

    setLoading(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlFetch = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await importFromUrl(url.trim());

    if (result.success && result.board) {
      setImportedBoard(result.board);
    } else {
      setError(result.error || 'Failed to fetch board from URL');
      setImportedBoard(null);
    }

    setLoading(false);
  };

  const handleImport = () => {
    if (!importedBoard) return;

    const processedBoard = processImportedBoard(
      importedBoard,
      existingBoardIds,
      collisionStrategy
    );

    onImport(processedBoard);

    // If there are more pending files, move to next file
    if (pendingFiles && currentFileIndex < pendingFiles.length - 1) {
      setCurrentFileIndex(prev => prev + 1);
      setImportedBoard(null);
      setError(null);
      setCollisionStrategy('rename');
    } else {
      // No more files, close modal
      onClose();
    }
  };

  const handleModeChange = (newMode: ImportMode) => {
    setMode(newMode);
    setError(null);
    setImportedBoard(null);
    setUrl('');
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-labelledby="import-modal-title"
      aria-modal="true"
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="import-modal-title" className="text-2xl font-bold">
                Import Board
              </h2>
              {pendingFiles && pendingFiles.length > 1 && (
                <p className="text-sm text-gray-600 mt-1">
                  Importing {currentFileIndex + 1} of {pendingFiles.length} boards
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded"
              aria-label="Close import modal"
              type="button"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-300">
            <button
              onClick={() => handleModeChange('file')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                mode === 'file'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
              type="button"
            >
              📁 File Upload
            </button>
            <button
              onClick={() => handleModeChange('url')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                mode === 'url'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
              type="button"
            >
              🔗 From URL
            </button>
          </div>

          {/* File Upload Mode */}
          {mode === 'file' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Select an .obf file from your device to import.
              </p>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".obf,application/json"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                  disabled={loading}
                />
                <label
                  htmlFor="file-input"
                  className={`inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Loading...' : '📁 Choose File'}
                </label>
              </div>
            </div>
          )}

          {/* URL Mode */}
          {mode === 'url' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter a URL to an .obf file to import.
              </p>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading) {
                      handleUrlFetch();
                    }
                  }}
                  placeholder="https://example.com/board.obf"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                  disabled={loading}
                />
                <button
                  onClick={handleUrlFetch}
                  disabled={loading || !url.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                >
                  {loading ? 'Fetching...' : 'Fetch'}
                </button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-900">{error}</p>
            </div>
          )}

          {/* Board Preview */}
          {importedBoard && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="font-semibold text-green-900 mb-2">Board Loaded</h3>
                <div className="text-sm text-green-800 space-y-1">
                  <p>
                    <strong>Name:</strong> {importedBoard.name}
                  </p>
                  <p>
                    <strong>Buttons:</strong> {importedBoard.buttons.length}
                  </p>
                  <p>
                    <strong>Grid:</strong> {importedBoard.grid.rows}×{importedBoard.grid.columns}
                  </p>
                  {importedBoard.description && (
                    <p>
                      <strong>Description:</strong> {importedBoard.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Collision Warning */}
              {hasCollision && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h4 className="font-semibold text-yellow-900 mb-2">⚠️ ID Collision Detected</h4>
                  <p className="text-sm text-yellow-800 mb-3">
                    A board with ID "{importedBoard.id}" already exists. Choose how to handle this:
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="collision-strategy"
                        value="rename"
                        checked={collisionStrategy === 'rename'}
                        onChange={(e) => setCollisionStrategy(e.target.value as CollisionStrategy)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-yellow-900">
                        <strong>Rename</strong> - Keep both boards (import with new ID)
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="collision-strategy"
                        value="replace"
                        checked={collisionStrategy === 'replace'}
                        onChange={(e) => setCollisionStrategy(e.target.value as CollisionStrategy)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-yellow-900">
                        <strong>Replace</strong> - Overwrite existing board
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-300 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!importedBoard || loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
