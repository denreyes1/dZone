import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { isFirebaseAvailable } from '@/config/firebase';
import * as service from '@/services/tagHistory';
import type { TaskTag } from '@/types/kanban';

const LOCAL_KEY = 'dzone_tag_history';

function loadLocal(): TaskTag[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLocal(tags: TaskTag[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(tags));
}

export function useTagHistory() {
  const user = useAuthStore((s) => s.user);
  const [history, setHistory] = useState<TaskTag[]>(loadLocal);

  useEffect(() => {
    if (!user?.uid || !isFirebaseAvailable()) {
      setHistory(loadLocal());
      return;
    }

    const unsub = service.subscribeTagHistory(user.uid, (tags) => {
      setHistory(tags);
      saveLocal(tags);
    });
    return unsub;
  }, [user?.uid]);

  const addToHistory = useCallback(
    (tag: TaskTag) => {
      setHistory((prev) => {
        if (prev.some((t) => t.label.toLowerCase() === tag.label.toLowerCase())) return prev;
        const next = [...prev, tag];
        saveLocal(next);
        if (user?.uid && isFirebaseAvailable()) {
          service.saveTagHistory(user.uid, next);
        }
        return next;
      });
    },
    [user?.uid],
  );

  return { history, addToHistory };
}
