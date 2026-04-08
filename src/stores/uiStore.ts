import { create } from 'zustand';

interface UIState {
  showSceneSelector: boolean;
  showBoard: boolean;
  showAudioMixer: boolean;
  showTimer: boolean;
  showTimerSettings: boolean;
  showStats: boolean;
  showYoutubePlayer: boolean;
  isFullscreen: boolean;
  isFocusMode: boolean;
  offlineMode: boolean;

  toggleSceneSelector: () => void;
  toggleBoard: () => void;
  setShowBoard: (v: boolean) => void;
  toggleAudioMixer: () => void;
  toggleTimer: () => void;
  toggleTimerSettings: () => void;
  toggleStats: () => void;
  toggleYoutubePlayer: () => void;
  setFullscreen: (v: boolean) => void;
  setFocusMode: (v: boolean) => void;
  setOfflineMode: (v: boolean) => void;
  closeAllPanels: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  showSceneSelector: false,
  showBoard: true,
  showAudioMixer: false,
  showTimer: true,
  showTimerSettings: false,
  showStats: false,
  showYoutubePlayer: false,
  isFullscreen: false,
  isFocusMode: false,
  offlineMode: false,

  toggleSceneSelector: () => set((s) => ({ showSceneSelector: !s.showSceneSelector, showAudioMixer: false, showStats: false })),
  toggleBoard: () => set((s) => ({ showBoard: !s.showBoard })),
  setShowBoard: (v) => set({ showBoard: v }),
  toggleAudioMixer: () => set((s) => ({ showAudioMixer: !s.showAudioMixer, showSceneSelector: false, showStats: false })),
  toggleTimer: () => set((s) => ({ showTimer: !s.showTimer })),
  toggleTimerSettings: () => set((s) => ({ showTimerSettings: !s.showTimerSettings })),
  toggleStats: () => set((s) => ({ showStats: !s.showStats, showSceneSelector: false, showAudioMixer: false })),
  toggleYoutubePlayer: () => set((s) => ({ showYoutubePlayer: !s.showYoutubePlayer })),
  setFullscreen: (v) => set({ isFullscreen: v }),
  setFocusMode: (v) => set({ isFocusMode: v }),
  setOfflineMode: (v) => set({ offlineMode: v }),
  closeAllPanels: () => set({ showSceneSelector: false, showBoard: false, showAudioMixer: false, showTimer: false, showTimerSettings: false, showStats: false, showYoutubePlayer: false }),
}));
