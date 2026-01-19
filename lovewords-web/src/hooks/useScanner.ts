/**
 * useScanner Hook - Switch Scanning for Motor Accessibility
 *
 * Manages automatic scanning state for users with motor impairments who use
 * switches (single or dual switch) for AAC communication.
 *
 * Features:
 * - Single-switch automatic scanning (highlight advances automatically)
 * - Single-switch step scanning (user advances manually)
 * - Configurable scan speed (0.5s - 5s)
 * - Linear scan pattern (left-to-right, top-to-bottom)
 *
 * @see docs/TECHNICAL_SPIKE_SWITCH_SCANNING.md
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import type { ObfBoard } from '../types/obf';

export interface ScannerConfig {
  enabled: boolean;
  scanSpeed: number; // milliseconds (500-5000)
  scanPattern: 'linear' | 'row-column'; // MVP: linear only
}

export interface ScanState {
  isScanning: boolean;
  highlightedCell: { row: number; col: number } | null;
}

export interface ScannerControls {
  scanState: ScanState;
  startScanning: () => void;
  stopScanning: () => void;
  selectCell: () => void;
}

/**
 * Hook for managing switch scanning state and behavior
 *
 * @param board - Current OBF board
 * @param config - Scanner configuration (enabled, speed, pattern)
 * @param onSelect - Callback when cell is selected (row, col)
 * @returns Scanner state and control functions
 */
export function useScanner(
  board: ObfBoard,
  config: ScannerConfig,
  onSelect: (row: number, col: number) => void
): ScannerControls {
  const [scanState, setScanState] = useState<ScanState>({
    isScanning: false,
    highlightedCell: null,
  });

  const timerRef = useRef<number | null>(null);

  /**
   * Get next cell coordinates based on scan pattern
   */
  const getNextCell = useCallback(
    (currentRow: number, currentCol: number): { row: number; col: number } => {
      const grid = board.grid;

      if (config.scanPattern === 'linear') {
        // Linear: left-to-right, top-to-bottom
        let nextCol = currentCol + 1;
        let nextRow = currentRow;

        if (nextCol >= grid.columns) {
          nextCol = 0;
          nextRow = currentRow + 1;
        }

        if (nextRow >= grid.rows) {
          nextRow = 0; // Wrap to start
        }

        return { row: nextRow, col: nextCol };
      }

      // TODO: Implement row-column scanning in Phase 2
      return { row: currentRow, col: currentCol };
    },
    [board, config.scanPattern]
  );

  /**
   * Advance highlight to next cell
   */
  const advanceHighlight = useCallback(() => {
    setScanState((prev) => {
      if (!prev.highlightedCell) {
        // Start at top-left
        return {
          ...prev,
          highlightedCell: { row: 0, col: 0 },
        };
      }

      const { row, col } = prev.highlightedCell;
      const nextCell = getNextCell(row, col);

      return {
        ...prev,
        highlightedCell: nextCell,
      };
    });
  }, [getNextCell]);

  /**
   * Start automatic scanning
   */
  const startScanning = useCallback(() => {
    if (scanState.isScanning) return; // Already scanning

    // Initialize at top-left
    setScanState({
      isScanning: true,
      highlightedCell: { row: 0, col: 0 },
    });

    // Start timer
    timerRef.current = window.setInterval(() => {
      advanceHighlight();
    }, config.scanSpeed);
  }, [config.scanSpeed, advanceHighlight, scanState.isScanning]);

  /**
   * Stop scanning
   */
  const stopScanning = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setScanState({
      isScanning: false,
      highlightedCell: null,
    });
  }, []);

  /**
   * Select currently highlighted cell
   */
  const selectCell = useCallback(() => {
    if (scanState.highlightedCell) {
      const { row, col } = scanState.highlightedCell;
      onSelect(row, col);
    }
  }, [scanState.highlightedCell, onSelect]);

  /**
   * Auto-start scanning when enabled
   */
  useEffect(() => {
    if (config.enabled && !scanState.isScanning) {
      startScanning();
    } else if (!config.enabled && scanState.isScanning) {
      stopScanning();
    }
  }, [config.enabled, scanState.isScanning, startScanning, stopScanning]);

  /**
   * Update scan speed when changed
   */
  useEffect(() => {
    if (scanState.isScanning && timerRef.current !== null) {
      // Restart timer with new speed
      window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        advanceHighlight();
      }, config.scanSpeed);
    }
  }, [config.scanSpeed, scanState.isScanning, advanceHighlight]);

  /**
   * Cleanup timer on unmount
   */
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    scanState,
    startScanning,
    stopScanning,
    selectCell,
  };
}
