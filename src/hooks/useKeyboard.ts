import { useEffect } from 'react';
import { useTimerStore } from '@/stores/timerStore';
import { useUIStore } from '@/stores/uiStore';
import { useFullscreen } from './useFullscreen';
import { KEYBOARD_SHORTCUTS } from '@/utils/constants';

export function useKeyboard() {
  const { isRunning, start, pause } = useTimerStore();
  const { toggleSceneSelector, toggleBoard, toggleAudioMixer, closeAllPanels } = useUIStore();
  const { toggle: toggleFullscreen } = useFullscreen();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (isTyping) return;

      switch (e.key) {
        case KEYBOARD_SHORTCUTS.TOGGLE_TIMER:
          e.preventDefault();
          isRunning ? pause() : start();
          break;
        case KEYBOARD_SHORTCUTS.TOGGLE_FULLSCREEN:
          toggleFullscreen();
          break;
        case KEYBOARD_SHORTCUTS.TOGGLE_TASKS:
          toggleBoard();
          break;
        case KEYBOARD_SHORTCUTS.TOGGLE_MIXER:
          toggleAudioMixer();
          break;
        case KEYBOARD_SHORTCUTS.TOGGLE_SCENES:
          toggleSceneSelector();
          break;
        case KEYBOARD_SHORTCUTS.ESCAPE:
          closeAllPanels();
          break;
      }
    }

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isRunning, start, pause, toggleFullscreen, toggleSceneSelector, toggleBoard, toggleAudioMixer, closeAllPanels]);
}
