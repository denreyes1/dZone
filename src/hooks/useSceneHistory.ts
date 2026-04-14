import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { isFirebaseAvailable } from '@/config/firebase';
import { useSceneStore } from '@/stores/sceneStore';
import * as service from '@/services/sceneHistory';
import { SCENES } from '@/utils/constants';
import type { Scene } from '@/types';

const LOCAL_SCENES_KEY = 'dzone_custom_scenes';
const LOCAL_LAST_SCENE_KEY = 'dzone_last_scene';

function loadLocalScenes(): Scene[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_SCENES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLocalScenes(scenes: Scene[]) {
  localStorage.setItem(LOCAL_SCENES_KEY, JSON.stringify(scenes));
}

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';

export function extractVideoId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match?.[1] ?? null;
}

export function useSceneHistory() {
  const user = useAuthStore((s) => s.user);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);
  const [customScenes, setCustomScenes] = useState<Scene[]>(loadLocalScenes);
  const [initialised, setInitialised] = useState(false);

  useEffect(() => {
    if (!user?.uid || !isFirebaseAvailable()) {
      setCustomScenes(loadLocalScenes());
      const lastScene = localStorage.getItem(LOCAL_LAST_SCENE_KEY);
      if (lastScene) setActiveScene(lastScene);
      setInitialised(true);
      return;
    }

    const unsub = service.subscribeSceneHistory(user.uid, (data) => {
      setCustomScenes(data.scenes);
      saveLocalScenes(data.scenes);
      if (!initialised && data.lastActiveSceneId) {
        setActiveScene(data.lastActiveSceneId);
      }
      setInitialised(true);
    });
    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const persistLastActive = useCallback(
    (sceneId: string) => {
      localStorage.setItem(LOCAL_LAST_SCENE_KEY, sceneId);
      if (user?.uid && isFirebaseAvailable()) {
        service.saveSceneHistory(user.uid, { lastActiveSceneId: sceneId });
      }
    },
    [user?.uid],
  );

  const addCustomScene = useCallback(
    (videoId: string): Scene | null => {
      const exists =
        SCENES.some((s) => s.videoId === videoId) ||
        customScenes.some((s) => s.videoId === videoId);
      if (exists) return customScenes.find((s) => s.videoId === videoId) ?? SCENES.find((s) => s.videoId === videoId) ?? null;

      const scene: Scene = {
        id: `yt-${videoId}`,
        name: `Custom ${customScenes.length + 1}`,
        description: 'YouTube video',
        videoId,
        gradient: DEFAULT_GRADIENT,
      };
      const next = [...customScenes, scene];
      setCustomScenes(next);
      saveLocalScenes(next);
      if (user?.uid && isFirebaseAvailable()) {
        service.saveSceneHistory(user.uid, { scenes: next });
      }
      return scene;
    },
    [user?.uid, customScenes],
  );

  const removeCustomScene = useCallback(
    (sceneId: string) => {
      const next = customScenes.filter((s) => s.id !== sceneId);
      setCustomScenes(next);
      saveLocalScenes(next);
      if (user?.uid && isFirebaseAvailable()) {
        service.saveSceneHistory(user.uid, { scenes: next });
      }
    },
    [user?.uid, customScenes],
  );

  const allScenes = [...SCENES, ...customScenes];

  return {
    customScenes,
    allScenes,
    addCustomScene,
    removeCustomScene,
    persistLastActive,
  };
}
