/**
 * Accessibility tests for Cell component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Cell } from '../Cell';
import type { ObfButton } from '../../types/obf';

expect.extend(toHaveNoViolations);

describe('Cell Accessibility', () => {
  const mockButton: ObfButton = {
    id: 'test-button',
    label: 'Test',
    vocalization: 'Test button',
    action: ':speak',
    background_color: '#FFB6C1',
  };

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Cell button={mockButton} onClick={vi.fn()} rowIndex={1} colIndex={1} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA gridcell role', () => {
    render(<Cell button={mockButton} onClick={vi.fn()} rowIndex={1} colIndex={1} />);

    const gridcell = screen.getByRole('gridcell');
    expect(gridcell).toBeInTheDocument();
  });

  it('should have aria-rowindex and aria-colindex', () => {
    render(<Cell button={mockButton} onClick={vi.fn()} rowIndex={2} colIndex={3} />);

    const gridcell = screen.getByRole('gridcell');
    expect(gridcell).toHaveAttribute('aria-rowindex', '2');
    expect(gridcell).toHaveAttribute('aria-colindex', '3');
  });

  it('should have accessible label from vocalization', () => {
    render(<Cell button={mockButton} onClick={vi.fn()} rowIndex={1} colIndex={1} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAccessibleName('Test button');
  });

  it('should fall back to label if no vocalization', () => {
    const buttonWithoutVocalization: ObfButton = {
      id: 'test-button',
      label: 'Fallback Label',
      action: ':speak',
    };

    render(
      <Cell button={buttonWithoutVocalization} onClick={vi.fn()} rowIndex={1} colIndex={1} />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAccessibleName('Fallback Label');
  });

  it('should mark empty cells as disabled and hidden', () => {
    render(<Cell onClick={vi.fn()} rowIndex={1} colIndex={1} />);

    const gridcell = screen.getByRole('gridcell');
    expect(gridcell).toHaveAttribute('aria-disabled', 'true');
    expect(gridcell).toHaveAttribute('aria-hidden', 'true');
  });

  it('should mark hidden buttons as disabled and hidden', () => {
    const hiddenButton: ObfButton = {
      id: 'hidden-button',
      label: 'Hidden',
      action: ':speak',
      hidden: true,
    };

    render(<Cell button={hiddenButton} onClick={vi.fn()} rowIndex={1} colIndex={1} />);

    const gridcell = screen.getByRole('gridcell');
    expect(gridcell).toHaveAttribute('aria-disabled', 'true');
    expect(gridcell).toHaveAttribute('aria-hidden', 'true');
  });
});
