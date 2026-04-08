import { create } from 'zustand';
import { SCENES } from '@/utils/constants';

interface SceneState {
  activeSceneId: string;
  setActiveScene: (id: string) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  activeSceneId: SCENES[0].id,
  setActiveScene: (id) => set({ activeSceneId: id }),
}));
