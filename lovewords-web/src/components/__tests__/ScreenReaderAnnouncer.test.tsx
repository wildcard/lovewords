/**
 * Tests for ScreenReaderAnnouncer component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScreenReaderAnnouncer } from '../ScreenReaderAnnouncer';

describe('ScreenReaderAnnouncer', () => {
  it('should render live regions', () => {
    render(<ScreenReaderAnnouncer announcement={null} />);

    // Should have polite live region
    const politeRegion = screen.getByRole('status');
    expect(politeRegion).toHaveAttribute('aria-live', 'polite');
    expect(politeRegion).toHaveAttribute('aria-atomic', 'true');

    // Should have assertive live region
    const assertiveRegion = screen.getByRole('alert');
    expect(assertiveRegion).toHaveAttribute('aria-live', 'assertive');
    expect(assertiveRegion).toHaveAttribute('aria-atomic', 'true');
  });

  it('should announce polite messages', () => {
    const { rerender } = render(<ScreenReaderAnnouncer announcement={null} />);

    const announcement = {
      message: 'Added word to message',
      priority: 'polite' as const,
      timestamp: Date.now(),
    };

    rerender(<ScreenReaderAnnouncer announcement={announcement} />);

    const politeRegion = screen.getByRole('status');
    expect(politeRegion).toHaveTextContent('Added word to message');
  });

  it('should announce assertive messages', () => {
    const { rerender } = render(<ScreenReaderAnnouncer announcement={null} />);

    const announcement = {
      message: 'Error loading board',
      priority: 'assertive' as const,
      timestamp: Date.now(),
    };

    rerender(<ScreenReaderAnnouncer announcement={announcement} />);

    const assertiveRegion = screen.getByRole('alert');
    expect(assertiveRegion).toHaveTextContent('Error loading board');
  });

  it('should have screen reader only styling', () => {
    render(<ScreenReaderAnnouncer announcement={null} />);

    const politeRegion = screen.getByRole('status');
    expect(politeRegion).toHaveClass('sr-only');

    const assertiveRegion = screen.getByRole('alert');
    expect(assertiveRegion).toHaveClass('sr-only');
  });
});
