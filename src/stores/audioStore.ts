import { create } from 'zustand';
import type { SoundState } from '@/types';

interface AudioState {
  sounds: Record<string, SoundState>;
  masterVolume: number;
  toggleSound: (id: string) => void;
  setSoundVolume: (id: string, volume: number) => void;
  setMasterVolume: (volume: number) => void;
  stopAll: () => void;
  loadPreset: (preset: Record<string, number>) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  sounds: {},
  masterVolume: 80,

  toggleSound: (id) =>
    set((state) => {
      const current = state.sounds[id];
      return {
        sounds: {
          ...state.sounds,
          [id]: current
            ? { ...current, playing: !current.playing }
            : { playing: true, volume: 60 },
        },
      };
    }),

  setSoundVolume: (id, volume) =>
    set((state) => ({
      sounds: {
        ...state.sounds,
        [id]: { ...(state.sounds[id] ?? { playing: true }), volume },
      },
    })),

  setMasterVolume: (volume) => set({ masterVolume: volume }),

  stopAll: () =>
    set((state) => ({
      sounds: Object.fromEntries(
        Object.entries(state.sounds).map(([k, v]) => [k, { ...v, playing: false }]),
      ),
    })),

  loadPreset: (preset) =>
    set({
      sounds: Object.fromEntries(
        Object.entries(preset).map(([id, volume]) => [id, { playing: volume > 0, volume }]),
      ),
    }),
}));
