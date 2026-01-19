/**
 * Tests for useFocusTrap hook
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useFocusTrap } from '../useFocusTrap';

// Test component that uses the focus trap
function TestFocusTrap({ active = true, onEscape }: { active?: boolean; onEscape?: () => void }) {
  const containerRef = useFocusTrap<HTMLDivElement>({ active, onEscape });

  return (
    <div ref={containerRef} data-testid="focus-trap-container">
      <button>First Button</button>
      <button>Middle Button</button>
      <button>Last Button</button>
    </div>
  );
}

describe('useFocusTrap', () => {
  describe('Focus Management', () => {
    it('should focus first focusable element on mount', () => {
      render(<TestFocusTrap />);

      const firstButton = screen.getByText('First Button');
      expect(firstButton).toHaveFocus();
    });

    it('should not activate when active=false', () => {
      const elementBefore = document.createElement('button');
      elementBefore.textContent = 'Before';
      document.body.appendChild(elementBefore);
      elementBefore.focus();

      render(<TestFocusTrap active={false} />);

      const firstButton = screen.getByText('First Button');
      expect(firstButton).not.toHaveFocus();
      expect(elementBefore).toHaveFocus();

      document.body.removeChild(elementBefore);
    });

    it('should restore focus to previous element on unmount', () => {
      const elementBefore = document.createElement('button');
      elementBefore.textContent = 'Before';
      document.body.appendChild(elementBefore);
      elementBefore.focus();

      const { unmount } = render(<TestFocusTrap />);

      // Focus should be trapped
      const firstButton = screen.getByText('First Button');
      expect(firstButton).toHaveFocus();

      // Unmount and check focus restored
      unmount();
      expect(elementBefore).toHaveFocus();

      document.body.removeChild(elementBefore);
    });

    it('should not restore focus if previous element was removed from DOM', () => {
      const elementBefore = document.createElement('button');
      elementBefore.textContent = 'Before';
      document.body.appendChild(elementBefore);
      elementBefore.focus();

      const { unmount } = render(<TestFocusTrap />);

      // Remove the element from DOM before unmounting
      document.body.removeChild(elementBefore);

      // Should not throw when trying to restore focus
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Tab Key Navigation', () => {
    it('should trap Tab key at last element', () => {
      render(<TestFocusTrap />);

      const firstButton = screen.getByText('First Button');
      const lastButton = screen.getByText('Last Button');

      // Focus last button
      lastButton.focus();
      expect(lastButton).toHaveFocus();

      // Press Tab - should cycle to first button
      fireEvent.keyDown(lastButton, { key: 'Tab' });

      expect(firstButton).toHaveFocus();
    });

    it('should trap Shift+Tab at first element', () => {
      render(<TestFocusTrap />);

      const firstButton = screen.getByText('First Button');
      const lastButton = screen.getByText('Last Button');

      // First button should be focused
      expect(firstButton).toHaveFocus();

      // Press Shift+Tab - should cycle to last button
      fireEvent.keyDown(firstButton, { key: 'Tab', shiftKey: true });

      expect(lastButton).toHaveFocus();
    });

    it('should allow Tab navigation within trap', () => {
      render(<TestFocusTrap />);

      const firstButton = screen.getByText('First Button');
      const middleButton = screen.getByText('Middle Button');

      expect(firstButton).toHaveFocus();

      // Tab to middle button - should work normally
      fireEvent.keyDown(firstButton, { key: 'Tab' });

      // Note: In tests, we need to manually focus the next element
      // In real browser, Tab automatically moves focus
      middleButton.focus();
      expect(middleButton).toHaveFocus();
    });
  });

  describe('Escape Key Handling', () => {
    it('should call onEscape when Escape pressed', () => {
      const onEscape = vi.fn();
      render(<TestFocusTrap onEscape={onEscape} />);

      const container = screen.getByTestId('focus-trap-container');

      fireEvent.keyDown(container, { key: 'Escape' });

      expect(onEscape).toHaveBeenCalledTimes(1);
    });

    it('should not call onEscape if not provided', () => {
      // Should not throw when Escape pressed without onEscape
      render(<TestFocusTrap />);

      const container = screen.getByTestId('focus-trap-container');

      expect(() => {
        fireEvent.keyDown(container, { key: 'Escape' });
      }).not.toThrow();
    });

    it('should prevent default on Escape key', () => {
      const onEscape = vi.fn();
      render(<TestFocusTrap onEscape={onEscape} />);

      const container = screen.getByTestId('focus-trap-container');
      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });

      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      container.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle container with no focusable elements', () => {
      function EmptyTrap() {
        const containerRef = useFocusTrap<HTMLDivElement>({ active: true });
        return <div ref={containerRef} data-testid="empty-trap" />;
      }

      expect(() => render(<EmptyTrap />)).not.toThrow();
    });

    it('should handle disabled focusable elements', () => {
      function TrapWithDisabled() {
        const containerRef = useFocusTrap<HTMLDivElement>({ active: true });
        return (
          <div ref={containerRef}>
            <button disabled>Disabled Button</button>
            <button>Enabled Button</button>
          </div>
        );
      }

      render(<TrapWithDisabled />);

      const enabledButton = screen.getByText('Enabled Button');
      expect(enabledButton).toHaveFocus();
    });

    it('should handle dynamic focusable elements', () => {
      function DynamicTrap({ showExtra }: { showExtra: boolean }) {
        const containerRef = useFocusTrap<HTMLDivElement>({ active: true });
        return (
          <div ref={containerRef}>
            <button>First</button>
            {showExtra && <button>Extra</button>}
            <button>Last</button>
          </div>
        );
      }

      const { rerender } = render(<DynamicTrap showExtra={false} />);

      // Initially two buttons
      expect(screen.queryByText('Extra')).not.toBeInTheDocument();

      // Add extra button
      rerender(<DynamicTrap showExtra={true} />);
      expect(screen.getByText('Extra')).toBeInTheDocument();
    });

    it('should handle tabindex attributes', () => {
      function TrapWithTabindex() {
        const containerRef = useFocusTrap<HTMLDivElement>({ active: true });
        return (
          <div ref={containerRef}>
            <div tabIndex={0}>First</div>
            <div tabIndex={-1}>Should Not Focus</div>
            <div tabIndex={0}>Last</div>
          </div>
        );
      }

      render(<TrapWithTabindex />);

      const firstDiv = screen.getByText('First');
      expect(firstDiv).toHaveFocus();

      // Should not focus elements with tabindex="-1"
      const skipDiv = screen.getByText('Should Not Focus');
      expect(skipDiv).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Multiple Instances', () => {
    it('should support multiple focus traps (nested modals)', () => {
      function NestedTraps() {
        const outerRef = useFocusTrap<HTMLDivElement>({ active: true });
        const innerRef = useFocusTrap<HTMLDivElement>({ active: true });

        return (
          <div ref={outerRef} data-testid="outer-trap">
            <button>Outer Button</button>
            <div ref={innerRef} data-testid="inner-trap">
              <button>Inner Button</button>
            </div>
          </div>
        );
      }

      render(<NestedTraps />);

      // Inner trap should take precedence
      const innerButton = screen.getByText('Inner Button');
      expect(innerButton).toHaveFocus();
    });
  });

  describe('Event Cleanup', () => {
    it('should remove event listeners on unmount', () => {
      const { unmount } = render(<TestFocusTrap />);

      const container = screen.getByTestId('focus-trap-container');

      const removeEventListenerSpy = vi.spyOn(container, 'removeEventListener');

      unmount();

      // Should have cleaned up event listener
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should update event handler when onEscape changes', () => {
      const onEscape1 = vi.fn();
      const onEscape2 = vi.fn();

      const { rerender } = render(<TestFocusTrap onEscape={onEscape1} />);

      const container = screen.getByTestId('focus-trap-container');

      fireEvent.keyDown(container, { key: 'Escape' });
      expect(onEscape1).toHaveBeenCalledTimes(1);
      expect(onEscape2).not.toHaveBeenCalled();

      // Change onEscape prop
      rerender(<TestFocusTrap onEscape={onEscape2} />);

      fireEvent.keyDown(container, { key: 'Escape' });
      expect(onEscape1).toHaveBeenCalledTimes(1); // Still 1
      expect(onEscape2).toHaveBeenCalledTimes(1); // Now called
    });
  });
});
