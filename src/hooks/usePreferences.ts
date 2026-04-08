import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useTimerStore } from '@/stores/timerStore';
import { useSceneStore } from '@/stores/sceneStore';
import { useAudioStore } from '@/stores/audioStore';
import { useUIStore } from '@/stores/uiStore';
import { isFirebaseAvailable } from '@/config/firebase';
import { getPreferences, savePreferences } from '@/services/preferences';
import { DEFAULT_PREFERENCES, type UserPreferences } from '@/types';

const LOCAL_KEY = 'dzone_preferences';

export function usePreferences() {
  const user = useAuthStore((s) => s.user);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const setDurations = useTimerStore((s) => s.setDurations);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);
  const loadPreset = useAudioStore((s) => s.loadPreset);
  const setShowBoard = useUIStore((s) => s.setShowBoard);

  const applyPreferences = useCallback(
    (prefs: UserPreferences) => {
      setPreferences(prefs);
      setDurations(prefs.focusDuration, prefs.breakDuration, prefs.longBreakDuration);
      if (prefs.preferredScene) setActiveScene(prefs.preferredScene);
      if (Object.keys(prefs.soundPresets).length > 0) loadPreset(prefs.soundPresets);
      if (prefs.showBoard !== undefined) setShowBoard(prefs.showBoard);
    },
    [setDurations, setActiveScene, loadPreset, setShowBoard],
  );

  useEffect(() => {
    async function load() {
      if (user?.uid && isFirebaseAvailable()) {
        try {
          const prefs = await getPreferences(user.uid);
          applyPreferences(prefs);
        } catch {
          const local = localStorage.getItem(LOCAL_KEY);
          if (local) applyPreferences(JSON.parse(local));
        }
      } else {
        const local = localStorage.getItem(LOCAL_KEY);
        if (local) applyPreferences(JSON.parse(local));
      }
    }
    load();
  }, [user?.uid, applyPreferences]);

  const updatePreferences = useCallback(
    async (updates: Partial<UserPreferences>) => {
      const merged = { ...preferences, ...updates };
      applyPreferences(merged);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(merged));
      if (user?.uid && isFirebaseAvailable()) {
        try {
          await savePreferences(user.uid, updates);
        } catch {
          // offline
        }
      }
    },
    [user?.uid, preferences, applyPreferences],
  );

  return { preferences, updatePreferences };
}
