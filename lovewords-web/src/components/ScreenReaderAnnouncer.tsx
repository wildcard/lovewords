/**
 * ScreenReaderAnnouncer component
 * Provides accessible announcements for screen reader users
 */

import { useEffect, useRef } from 'react';
import type { Announcement } from '../hooks/useAnnouncer';

export interface ScreenReaderAnnouncerProps {
  announcement: Announcement | null;
}

export function ScreenReaderAnnouncer({ announcement }: ScreenReaderAnnouncerProps) {
  const politeRef = useRef<HTMLDivElement>(null);
  const assertiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!announcement) return;

    const targetRef = announcement.priority === 'assertive' ? assertiveRef : politeRef;

    if (targetRef.current) {
      // Clear first to ensure the announcement is picked up even if it's the same text
      targetRef.current.textContent = '';

      // Use requestAnimationFrame to ensure the clear happens before the new content
      requestAnimationFrame(() => {
        if (targetRef.current) {
          targetRef.current.textContent = announcement.message;
        }
      });
    }
  }, [announcement]);

  return (
    <>
      {/* Screen reader only live regions */}
      <div
        ref={politeRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
      <div
        ref={assertiveRef}
        className="sr-only"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      />
    </>
  );
}
