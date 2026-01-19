/**
 * Hook for making screen reader announcements
 * Provides a way to announce actions to screen reader users
 */

import { useState, useCallback } from 'react';

export type AnnouncementPriority = 'polite' | 'assertive';

export interface Announcement {
  message: string;
  priority: AnnouncementPriority;
  timestamp: number;
}

export function useAnnouncer() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  const announce = useCallback((message: string, priority: AnnouncementPriority = 'polite') => {
    setAnnouncement({
      message,
      priority,
      timestamp: Date.now(),
    });
  }, []);

  const clear = useCallback(() => {
    setAnnouncement(null);
  }, []);

  return {
    announcement,
    announce,
    clear,
  };
}
