import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { isFirebaseAvailable } from '@/config/firebase';
import { getTodaySessions, getRecentSessions } from '@/services/sessions';
import { getStreak } from '@/services/stats';
import type { FocusSession } from '@/types';

export function useSessions() {
  const user = useAuthStore((s) => s.user);
  const [todaySessions, setTodaySessions] = useState<FocusSession[]>([]);
  const [recentSessions, setRecentSessions] = useState<FocusSession[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user?.uid || !isFirebaseAvailable()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [today, recent, s] = await Promise.all([
        getTodaySessions(user.uid),
        getRecentSessions(user.uid),
        getStreak(user.uid),
      ]);
      setTodaySessions(today);
      setRecentSessions(recent);
      setStreak(s);
    } catch {
      // offline
    }
    setLoading(false);
  }, [user?.uid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const todayFocusTime = todaySessions
    .filter((s) => s.type === 'focus')
    .reduce((acc, s) => acc + s.duration, 0);

  const todaySessionCount = todaySessions.filter((s) => s.type === 'focus').length;

  return {
    todaySessions,
    recentSessions,
    streak,
    todayFocusTime,
    todaySessionCount,
    loading,
    refresh,
  };
}
