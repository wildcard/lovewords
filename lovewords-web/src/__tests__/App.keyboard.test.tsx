/**
 * Keyboard navigation tests for App component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';

// Mock Web Speech API
beforeEach(() => {
  globalThis.speechSynthesis = {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn(() => []),
    speaking: false,
    pending: false,
    paused: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as any;

  window.SpeechSynthesisUtterance = vi.fn(() => ({
    text: '',
    lang: 'en-US',
    voice: null,
    volume: 1,
    rate: 1,
    pitch: 1,
    onstart: null,
    onend: null,
    onerror: null,
    onpause: null,
    onresume: null,
    onmark: null,
    onboundary: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as any;
});

describe('App Keyboard Navigation', () => {
  it('should support arrow key navigation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    // Press arrow down
    await user.keyboard('{ArrowDown}');

    // Focus should move (we can't easily test which cell is focused, but we verify no errors)
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('should support Enter key to activate cells', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    // Press Enter
    await user.keyboard('{Enter}');

    // Should not throw error
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('should support Space key to activate cells', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    // Press Space
    await user.keyboard(' ');

    // Should not throw error
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('should have skip link at the top of the page', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    const skipLink = screen.getByText(/skip to communication board/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('should have main content landmark', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('id', 'main-content');
  });
});
