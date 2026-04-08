import { useEffect, useCallback, useRef } from 'react';
import { useTimerStore } from '@/stores/timerStore';
import { useSceneStore } from '@/stores/sceneStore';
import { useAuthStore } from '@/stores/authStore';
import { saveSession } from '@/services/sessions';
import { updateStreak } from '@/services/stats';

export function useTimer() {
  const { isRunning, timeRemaining, mode, tick, skip, incrementSessions, sessionStartTime, focusDuration, breakDuration, longBreakDuration } =
    useTimerStore();
  const stopwatchRunning = useTimerStore((s) => s.stopwatchRunning);
  const tickStopwatch = useTimerStore((s) => s.tickStopwatch);
  const activeSceneId = useSceneStore((s) => s.activeSceneId);
  const user = useAuthStore((s) => s.user);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const swIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => tick(), 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, tick]);

  useEffect(() => {
    if (stopwatchRunning) {
      swIntervalRef.current = setInterval(() => tickStopwatch(), 1000);
    }
    return () => {
      if (swIntervalRef.current) clearInterval(swIntervalRef.current);
    };
  }, [stopwatchRunning, tickStopwatch]);

  useEffect(() => {
    if (timeRemaining === 0 && isRunning) {
      handleSessionComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, isRunning]);

  const handleSessionComplete = useCallback(async () => {
    if (mode === 'focus') {
      incrementSessions();
      if (user?.uid) {
        const durationSecs = sessionStartTime
          ? Math.round((Date.now() - sessionStartTime) / 1000)
          : focusDuration * 60;
        try {
          await saveSession(user.uid, activeSceneId, durationSecs, 'focus');
          await updateStreak(user.uid);
        } catch {
          // offline fallback — session not saved
        }
      }
    }
    skip();
  }, [mode, user, activeSceneId, sessionStartTime, focusDuration, incrementSessions, skip]);

  return { handleSessionComplete };
}
