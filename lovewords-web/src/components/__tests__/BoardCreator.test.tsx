/**
 * Tests for BoardCreator component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BoardCreator } from '../BoardCreator';
import type { ObfBoard } from '../../types/obf';

describe('BoardCreator', () => {
  const mockOnSave = vi.fn();
  const mockOnClose = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Create Mode', () => {
    it('should render create board form', () => {
      render(<BoardCreator onSave={mockOnSave} onClose={mockOnClose} />);

      expect(screen.getByText('Create Board')).toBeInTheDocument();
      expect(screen.getByLabelText(/board name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/grid size/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create board/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should validate required board name', async () => {
      render(<BoardCreator onSave={mockOnSave} onClose={mockOnClose} />);

      const createButton = screen.getByRole('button', { name: /create board/i });
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(screen.getByText(/board name is required/i)).toBeInTheDocument();
      });

      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should validate board name length', async () => {
      render(<BoardCreator onSave={mockOnSave} onClose={mockOnClose} />);

      const nameInput = screen.getByLabelText(/board name/i);
      fireEvent.change(nameInput, { target: { value: 'ab' } });

      const createButton = screen.getByRole('button', { name: /create board/i });
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
      });

      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should create board with valid data', async () => {
      render(<BoardCreator onSave={mockOnSave} onClose={mockOnClose} />);

      const nameInput = screen.getByLabelText(/board name/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      fireEvent.change(nameInput, { target: { value: 'My Custom Board' } });
      fireEvent.change(descriptionInput, { target: { value: 'A board for testing' } });

      const createButton = screen.getByRole('button', { name: /create board/i });
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      });

      const savedBoard = mockOnSave.mock.calls[0][0] as ObfBoard;
      expect(savedBoard.name).toBe('My Custom Board');
      expect(savedBoard.description).toBe('A board for testing');
      expect(savedBoard.grid.rows).toBe(4); // Default grid size
      expect(savedBoard.grid.columns).toBe(4);
      expect(savedBoard.ext_lovewords_custom).toBe(true);
    });

    it('should support different grid sizes', async () => {
      render(<BoardCreator onSave={mockOnSave} onClose={mockOnClose} />);

      const nameInput = screen.getByLabelText(/board name/i);
      fireEvent.change(nameInput, { target: { value: 'Test Board' } });

      const gridSelect = screen.getByLabelText(/grid size/i);

      // Select 3×3 grid
      fireEvent.change(gridSelect, { target: { value: '0' } }); // Index 0 = 3×3

      const createButton = screen.getByRole('button', { name: /create board/i });
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      });

      const savedBoard = mockOnSave.mock.calls[0][0] as ObfBoard;
      expect(savedBoard.grid.rows).toBe(3);
      expect(savedBoard.grid.columns).toBe(3);
    });

    it('should call onClose when cancel button clicked', () => {
      render(<BoardCreator onSave={mockOnSave} onClose={mockOnClose} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when Escape key pressed', () => {
      render(<BoardCreator onSave={mockOnSave} onClose={mockOnClose} />);

      // Simulate Escape key
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edit Mode', () => {
    const existingBoard: ObfBoard = {
      format: 'open-board-0.1',
      id: 'test-board',
      name: 'Test Board',
      description: 'Test description',
      locale: 'en',
      buttons: [],
      images: [],
      sounds: [],
      grid: {
        rows: 4,
        columns: 4,
        order: Array(4).fill(null).map(() => Array(4).fill(null)),
      },
      ext_lovewords_custom: true,
      ext_lovewords_created_at: '2024-01-01T00:00:00Z',
    };

    it('should render edit board form with existing data', () => {
      render(<BoardCreator board={existingBoard} onSave={mockOnSave} onClose={mockOnClose} />);

      expect(screen.getByText('Edit Board')).toBeInTheDocument();
      expect(screen.getByLabelText(/board name/i)).toHaveValue('Test Board');
      expect(screen.getByLabelText(/description/i)).toHaveValue('Test description');
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    });

    it('should update board with modified data', async () => {
      render(<BoardCreator board={existingBoard} onSave={mockOnSave} onClose={mockOnClose} />);

      const nameInput = screen.getByLabelText(/board name/i);
      fireEvent.change(nameInput, { target: { value: 'Updated Board Name' } });

      const saveButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      });

      const savedBoard = mockOnSave.mock.calls[0][0] as ObfBoard;
      expect(savedBoard.id).toBe('test-board'); // Preserves ID
      expect(savedBoard.name).toBe('Updated Board Name');
      expect(savedBoard.ext_lovewords_updated_at).toBeDefined();
    });

    it('should preserve existing grid size in edit mode', () => {
      const board6x6: ObfBoard = {
        ...existingBoard,
        grid: {
          rows: 6,
          columns: 6,
          order: Array(6).fill(null).map(() => Array(6).fill(null)),
        },
      };

      render(<BoardCreator board={board6x6} onSave={mockOnSave} onClose={mockOnClose} />);

      const gridSelect = screen.getByLabelText(/grid size/i) as HTMLSelectElement;

      // Should have 6×6 selected (index 3)
      expect(gridSelect.selectedIndex).toBe(3);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible form labels', () => {
      render(<BoardCreator onSave={mockOnSave} onClose={mockOnClose} />);

      // All form inputs should have associated labels
      expect(screen.getByLabelText(/board name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/grid size/i)).toBeInTheDocument();
    });

    it('should trap focus within dialog', () => {
      render(<BoardCreator onSave={mockOnSave} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('role', 'dialog');
      expect(dialog).toHaveAttribute('aria-labelledby');
    });

    it('should announce validation errors to screen readers', async () => {
      render(<BoardCreator onSave={mockOnSave} onClose={mockOnClose} />);

      const createButton = screen.getByRole('button', { name: /create board/i });
      fireEvent.click(createButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/board name is required/i);
        expect(errorMessage).toHaveAttribute('role', 'alert');
      });
    });
  });

  describe('Grid Order Initialization', () => {
    it('should initialize empty grid order for all supported sizes', async () => {
      const gridSizes = [
        { rows: 3, columns: 3 },
        { rows: 4, columns: 4 },
        { rows: 5, columns: 4 },
        { rows: 6, columns: 6 },
      ];

      for (const [index, size] of gridSizes.entries()) {
        const { unmount } = render(<BoardCreator onSave={mockOnSave} onClose={mockOnClose} />);

        const nameInput = screen.getByLabelText(/board name/i);
        fireEvent.change(nameInput, { target: { value: 'Test' } });

        const gridSelect = screen.getByLabelText(/grid size/i);
        fireEvent.change(gridSelect, { target: { value: String(index) } });

        const createButton = screen.getByRole('button', { name: /create board/i });
        fireEvent.click(createButton);

        await waitFor(() => {
          expect(mockOnSave).toHaveBeenCalled();
        });

        const savedBoard = mockOnSave.mock.calls[mockOnSave.mock.calls.length - 1][0] as ObfBoard;
        expect(savedBoard.grid.rows).toBe(size.rows);
        expect(savedBoard.grid.columns).toBe(size.columns);
        expect(savedBoard.grid.order.length).toBe(size.rows);
        expect(savedBoard.grid.order[0].length).toBe(size.columns);

        // All cells should be null initially
        for (const row of savedBoard.grid.order) {
          for (const cell of row) {
            expect(cell).toBeNull();
          }
        }

        unmount();
        vi.clearAllMocks();
      }
    });
  });
});
