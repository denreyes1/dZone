import { create } from 'zustand';
import { SCENES } from '@/utils/constants';

const LOCAL_LAST_SCENE_KEY = 'dzone_last_scene';

function getInitialScene(): string {
  try {
    return localStorage.getItem(LOCAL_LAST_SCENE_KEY) ?? SCENES[0].id;
  } catch {
    return SCENES[0].id;
  }
}

interface SceneState {
  activeSceneId: string;
  setActiveScene: (id: string) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  activeSceneId: getInitialScene(),
  setActiveScene: (id) => {
    localStorage.setItem(LOCAL_LAST_SCENE_KEY, id);
    set({ activeSceneId: id });
  },
}));
