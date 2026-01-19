/**
 * Accessibility tests for Settings modal
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Settings } from '../Settings';
import { DEFAULT_PROFILE } from '../../types/profile';

expect.extend(toHaveNoViolations);

describe('Settings Modal Accessibility', () => {
  const mockProps = {
    profile: DEFAULT_PROFILE,
    voices: [],
    onChange: vi.fn(),
    onClose: vi.fn(),
    onTestSpeech: vi.fn(),
  };

  it('should have no accessibility violations', async () => {
    const { container } = render(<Settings {...mockProps} />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper dialog role', () => {
    render(<Settings {...mockProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('should have aria-modal attribute', () => {
    render(<Settings {...mockProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('should be labeled by title', () => {
    render(<Settings {...mockProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'settings-title');

    const title = screen.getByText('Settings');
    expect(title).toHaveAttribute('id', 'settings-title');
  });

  it('should be described by description', () => {
    render(<Settings {...mockProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-describedby', 'settings-description');

    const description = screen.getByText(/customize your lovewords experience/i);
    expect(description).toHaveAttribute('id', 'settings-description');
  });

  it('should close on Escape key', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<Settings {...mockProps} onClose={onClose} />);

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
  });

  it('should have keyboard shortcuts documentation', () => {
    render(<Settings {...mockProps} />);

    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    expect(screen.getByText('Navigate cells')).toBeInTheDocument();
    expect(screen.getByText('Activate cell')).toBeInTheDocument();
    expect(screen.getByText('Skip to main board')).toBeInTheDocument();
    expect(screen.getByText('Close settings')).toBeInTheDocument();
  });

  it('should have proper form controls with labels', () => {
    render(<Settings {...mockProps} />);

    // Voice select should have label
    const voiceLabel = screen.getByLabelText(/voice/i);
    expect(voiceLabel).toBeInTheDocument();

    // Checkboxes should have labels
    expect(screen.getByLabelText(/show button labels/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/show button images/i)).toBeInTheDocument();
  });

  it('should have Close button', () => {
    render(<Settings {...mockProps} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('should have Test Speech button', () => {
    render(<Settings {...mockProps} />);

    const testButton = screen.getByRole('button', { name: /test speech/i });
    expect(testButton).toBeInTheDocument();
  });
});
