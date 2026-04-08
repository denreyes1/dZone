import { useCallback, useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';

export function useFullscreen() {
  const setFullscreen = useUIStore((s) => s.setFullscreen);

  useEffect(() => {
    function handler() {
      setFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, [setFullscreen]);

  const toggle = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // fullscreen not supported
    }
  }, []);

  return { toggle };
}
