/**
 * Accessibility tests for Board component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Board } from '../Board';
import type { ObfBoard } from '../../types/obf';

expect.extend(toHaveNoViolations);

describe('Board Accessibility', () => {
  const mockBoard: ObfBoard = {
    format: 'open-board-0.1',
    id: 'test-board',
    name: 'Test Board',
    locale: 'en',
    buttons: [
      {
        id: 'btn_1',
        label: 'Button 1',
        vocalization: 'Button one',
        action: ':speak',
        background_color: '#FFB6C1',
      },
      {
        id: 'btn_2',
        label: 'Button 2',
        vocalization: 'Button two',
        action: ':speak',
        background_color: '#87CEEB',
      },
    ],
    images: [],
    sounds: [],
    grid: {
      rows: 2,
      columns: 2,
      order: [
        ['btn_1', 'btn_2'],
        [null, null],
      ],
    },
  };

  it('should have no accessibility violations', async () => {
    const { container } = render(<Board board={mockBoard} onCellClick={vi.fn()} />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA grid role', () => {
    render(<Board board={mockBoard} onCellClick={vi.fn()} />);

    const grid = screen.getByRole('grid');
    expect(grid).toBeInTheDocument();
  });

  it('should have descriptive aria-label', () => {
    render(<Board board={mockBoard} onCellClick={vi.fn()} />);

    const grid = screen.getByRole('grid');
    expect(grid).toHaveAccessibleName('Test Board communication board');
  });

  it('should have gridcells for all cells including empty ones', () => {
    render(<Board board={mockBoard} onCellClick={vi.fn()} />);

    const gridcells = screen.getAllByRole('gridcell');
    expect(gridcells).toHaveLength(4); // 2x2 grid
  });

  it('should have buttons within gridcells for non-empty cells', () => {
    render(<Board board={mockBoard} onCellClick={vi.fn()} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2); // Only 2 non-empty cells
  });
});
