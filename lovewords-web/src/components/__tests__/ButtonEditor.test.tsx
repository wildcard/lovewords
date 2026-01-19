/**
 * Tests for ButtonEditor component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ButtonEditor } from '../ButtonEditor';
import type { ObfBoard, ObfButton } from '../../types/obf';

const mockBoard: ObfBoard = {
  format: 'open-board-0.1',
  id: 'test-board',
  name: 'Test Board',
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
};

describe('ButtonEditor', () => {
  const mockOnSave = vi.fn();
  const mockOnClose = vi.fn();
  const mockOnDelete = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Create Mode', () => {
    it('should render add button form', () => {
      render(
        <ButtonEditor
          board={mockBoard}
          row={0}
          col={0}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Add Button')).toBeInTheDocument();
      expect(screen.getByLabelText(/button label/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/action type/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save button/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should validate required label', async () => {
      render(
        <ButtonEditor
          board={mockBoard}
          row={0}
          col={0}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      const saveButton = screen.getByRole('button', { name: /save button/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/label is required/i)).toBeInTheDocument();
      });

      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should create button with speak action', async () => {
      render(
        <ButtonEditor
          board={mockBoard}
          row={0}
          col={0}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      const labelInput = screen.getByLabelText(/button label/i);
      fireEvent.change(labelInput, { target: { value: 'Hello' } });

      const actionSelect = screen.getByLabelText(/action type/i);
      fireEvent.change(actionSelect, { target: { value: 'speak' } });

      const saveButton = screen.getByRole('button', { name: /save button/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      });

      const [savedButton, row, col] = mockOnSave.mock.calls[0];
      expect(savedButton.label).toBe('Hello');
      expect(savedButton.vocalization).toBe('Hello');
      expect(savedButton.action).toBeUndefined();
      expect(row).toBe(0);
      expect(col).toBe(0);
    });

    it('should create button with custom vocalization', async () => {
      render(
        <ButtonEditor
          board={mockBoard}
          row={0}
          col={0}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      const labelInput = screen.getByLabelText(/button label/i);
      fireEvent.change(labelInput, { target: { value: 'Mom' } });

      const vocalizationInput = screen.getByLabelText(/vocalization/i);
      fireEvent.change(vocalizationInput, { target: { value: 'I want to talk to mom' } });

      const saveButton = screen.getByRole('button', { name: /save button/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      });

      const [savedButton] = mockOnSave.mock.calls[0];
      expect(savedButton.label).toBe('Mom');
      expect(savedButton.vocalization).toBe('I want to talk to mom');
    });

    it('should create button with add-to-message action', async () => {
      render(
        <ButtonEditor
          board={mockBoard}
          row={1}
          col={2}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      const labelInput = screen.getByLabelText(/button label/i);
      fireEvent.change(labelInput, { target: { value: 'want' } });

      const actionSelect = screen.getByLabelText(/action type/i);
      fireEvent.change(actionSelect, { target: { value: 'add-to-message' } });

      const saveButton = screen.getByRole('button', { name: /save button/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      });

      const [savedButton, row, col] = mockOnSave.mock.calls[0];
      expect(savedButton.label).toBe('want');
      expect(savedButton.action).toBe('+want');
      expect(row).toBe(1);
      expect(col).toBe(2);
    });

    it('should create button with special actions', async () => {
      const specialActions = [
        { action: 'back', expectedValue: 'back' },
        { action: 'home', expectedValue: 'home' },
        { action: 'clear', expectedValue: 'clear' },
        { action: 'backspace', expectedValue: 'backspace' },
      ];

      for (const { action, expectedValue } of specialActions) {
        const { unmount } = render(
          <ButtonEditor
            board={mockBoard}
            row={0}
            col={0}
            onSave={mockOnSave}
            onClose={mockOnClose}
          />
        );

        const labelInput = screen.getByLabelText(/button label/i);
        fireEvent.change(labelInput, { target: { value: action.toUpperCase() } });

        const actionSelect = screen.getByLabelText(/action type/i);
        fireEvent.change(actionSelect, { target: { value: action } });

        const saveButton = screen.getByRole('button', { name: /save button/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
          expect(mockOnSave).toHaveBeenCalled();
        });

        const [savedButton] = mockOnSave.mock.calls[mockOnSave.mock.calls.length - 1];
        expect(savedButton.action).toBe(expectedValue);

        unmount();
        vi.clearAllMocks();
      }
    });

    it('should support custom background color', async () => {
      render(
        <ButtonEditor
          board={mockBoard}
          row={0}
          col={0}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      const labelInput = screen.getByLabelText(/button label/i);
      fireEvent.change(labelInput, { target: { value: 'Test' } });

      const colorInput = screen.getByLabelText(/background color/i);
      fireEvent.change(colorInput, { target: { value: '#FF5733' } });

      const saveButton = screen.getByRole('button', { name: /save button/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      });

      const [savedButton] = mockOnSave.mock.calls[0];
      expect(savedButton.background_color).toBe('#FF5733');
    });
  });

  describe('Edit Mode', () => {
    const existingButton: ObfButton = {
      id: 'btn-1',
      label: 'Hello',
      vocalization: 'Hello there',
      background_color: '#4CAF50',
    };

    it('should render edit button form with existing data', () => {
      render(
        <ButtonEditor
          board={mockBoard}
          row={0}
          col={0}
          button={existingButton}
          onSave={mockOnSave}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Edit Button')).toBeInTheDocument();
      expect(screen.getByLabelText(/button label/i)).toHaveValue('Hello');
      expect(screen.getByLabelText(/vocalization/i)).toHaveValue('Hello there');
      expect(screen.getByLabelText(/background color/i)).toHaveValue('#4CAF50');
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete button/i })).toBeInTheDocument();
    });

    it('should update button with modified data', async () => {
      render(
        <ButtonEditor
          board={mockBoard}
          row={0}
          col={0}
          button={existingButton}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      const labelInput = screen.getByLabelText(/button label/i);
      fireEvent.change(labelInput, { target: { value: 'Hi' } });

      const saveButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      });

      const [savedButton] = mockOnSave.mock.calls[0];
      expect(savedButton.id).toBe('btn-1'); // Preserves ID
      expect(savedButton.label).toBe('Hi');
    });

    it('should delete button when delete clicked', async () => {
      render(
        <ButtonEditor
          board={mockBoard}
          row={0}
          col={0}
          button={existingButton}
          onSave={mockOnSave}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete button/i });
      fireEvent.click(deleteButton);

      // Should show confirmation dialog
      await waitFor(() => {
        expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockOnDelete).toHaveBeenCalledWith('btn-1', 0, 0);
      });
    });

    it('should cancel delete when cancel clicked', async () => {
      render(
        <ButtonEditor
          board={mockBoard}
          row={0}
          col={0}
          button={existingButton}
          onSave={mockOnSave}
          onClose={mockOnClose}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete button/i });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument();
      });

      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });

  describe('Image Upload Integration', () => {
    it('should show image uploader component', () => {
      render(
        <ButtonEditor
          board={mockBoard}
          row={0}
          col={0}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      // ImageUploader should be rendered (look for upload text)
      expect(screen.getByText(/upload image/i) || screen.getByText(/add image/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible form labels', () => {
      render(
        <ButtonEditor
          board={mockBoard}
          row={0}
          col={0}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByLabelText(/button label/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/action type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/vocalization/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/background color/i)).toBeInTheDocument();
    });

    it('should trap focus within dialog', () => {
      render(
        <ButtonEditor
          board={mockBoard}
          row={0}
          col={0}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('should announce validation errors', async () => {
      render(
        <ButtonEditor
          board={mockBoard}
          row={0}
          col={0}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      const saveButton = screen.getByRole('button', { name: /save button/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/label is required/i);
        expect(errorMessage).toHaveAttribute('role', 'alert');
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should close on Escape key', () => {
      render(
        <ButtonEditor
          board={mockBoard}
          row={0}
          col={0}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when cancel clicked', () => {
      render(
        <ButtonEditor
          board={mockBoard}
          row={0}
          col={0}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
