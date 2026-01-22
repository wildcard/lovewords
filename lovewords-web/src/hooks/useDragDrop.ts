/**
 * Custom hook for drag-and-drop file import
 * Handles drag events and provides visual feedback
 */

import { useState, useCallback, useEffect } from 'react';

export interface UseDragDropOptions {
  /** Callback when files are dropped */
  onDrop: (files: File[]) => void;
  /** Accepted file extensions (e.g., ['.obf', '.json']) */
  accept?: string[];
  /** Enable or disable drag-and-drop */
  enabled?: boolean;
}

export interface UseDragDropResult {
  /** Whether a file is being dragged over the drop zone */
  isDragging: boolean;
  /** Number of drag enter events (for nested elements) */
  dragDepth: number;
}

/**
 * Hook for handling drag-and-drop file imports
 *
 * @example
 * const { isDragging } = useDragDrop({
 *   onDrop: (files) => console.log('Dropped:', files),
 *   accept: ['.obf'],
 *   enabled: true
 * });
 */
export function useDragDrop(options: UseDragDropOptions): UseDragDropResult {
  const { onDrop, accept = ['.obf'], enabled = true } = options;

  const [isDragging, setIsDragging] = useState(false);
  const [dragDepth, setDragDepth] = useState(0);

  /**
   * Check if a file has an accepted extension
   */
  const isAcceptedFile = useCallback((file: File): boolean => {
    if (accept.length === 0) return true;
    return accept.some(ext => file.name.toLowerCase().endsWith(ext.toLowerCase()));
  }, [accept]);

  /**
   * Handle drag enter event
   */
  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!enabled) return;

    // Track drag depth to handle nested elements
    setDragDepth(prev => prev + 1);
    setIsDragging(true);
  }, [enabled]);

  /**
   * Handle drag over event
   */
  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!enabled) return;

    // Set dropEffect to show appropriate cursor
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  }, [enabled]);

  /**
   * Handle drag leave event
   */
  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!enabled) return;

    // Decrement drag depth
    setDragDepth(prev => {
      const newDepth = prev - 1;
      if (newDepth === 0) {
        setIsDragging(false);
      }
      return newDepth;
    });
  }, [enabled]);

  /**
   * Handle drop event
   */
  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!enabled) return;

    // Reset drag state
    setIsDragging(false);
    setDragDepth(0);

    // Get dropped files
    const files = Array.from(e.dataTransfer?.files || []);

    // Filter by accepted extensions
    const acceptedFiles = files.filter(isAcceptedFile);

    // Call onDrop with accepted files
    if (acceptedFiles.length > 0) {
      onDrop(acceptedFiles);
    }
  }, [enabled, onDrop, isAcceptedFile]);

  /**
   * Set up global drag-and-drop event listeners
   */
  useEffect(() => {
    if (!enabled) return;

    // Add event listeners to document
    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);

    // Cleanup
    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('drop', handleDrop);
    };
  }, [enabled, handleDragEnter, handleDragOver, handleDragLeave, handleDrop]);

  return {
    isDragging,
    dragDepth,
  };
}
