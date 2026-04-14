import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { isFirebaseAvailable } from '@/config/firebase';
import * as service from '@/services/boardTasks';
import type { BoardTask, TaskTag, ChecklistItem } from '@/types/kanban';

const LOCAL_KEY = 'dzone_board_tasks';

function loadLocal(): BoardTask[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLocal(tasks: BoardTask[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(tasks));
}

export function useBoardTasks() {
  const user = useAuthStore((s) => s.user);
  const [tasks, setTasks] = useState<BoardTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const migrationAttempted = useRef(false);

  useEffect(() => {
    if (!user?.uid || !isFirebaseAvailable()) {
      setTasks(loadLocal());
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = service.subscribeBoardTasks(user.uid, (t) => {
      setTasks(t);
      setLoading(false);

      if (t.length === 0 && !migrationAttempted.current) {
        migrationAttempted.current = true;
        service.migrateLegacyTasks(user.uid).then((migrated) => {
          if (migrated.length > 0) setTasks(migrated);
        }).catch(() => {});
      }
    });
    return unsub;
  }, [user?.uid]);

  const addTask = useCallback(
    async (title: string, description: string, column: string, tags: TaskTag[] = [], checklist: ChecklistItem[] = []) => {
      const colTasks = tasks.filter((t) => t.column === column);
      const order = colTasks.length;
      const id = crypto.randomUUID();

      const optimistic: BoardTask = {
        id,
        title,
        description,
        checklist,
        column,
        order,
        tags,
        createdAt: null,
        updatedAt: null,
      };
      setTasks((prev) => [...prev, optimistic]);
      saveLocal([...tasks, optimistic]);

      if (user?.uid && isFirebaseAvailable()) {
        try {
          await service.addBoardTask(user.uid, title, description, column, order, tags, checklist);
        } catch (e: any) {
          setError(e.message);
        }
      }
    },
    [user?.uid, tasks],
  );

  const updateTask = useCallback(
    async (taskId: string, updates: Partial<Pick<BoardTask, 'title' | 'description' | 'checklist' | 'column' | 'order' | 'tags'>>) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
      );
      const updated = tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
      saveLocal(updated);

      if (user?.uid && isFirebaseAvailable()) {
        try {
          await service.updateBoardTask(user.uid, taskId, updates);
        } catch (e: any) {
          setError(e.message);
        }
      }
    },
    [user?.uid, tasks],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      const updated = tasks.filter((t) => t.id !== taskId);
      saveLocal(updated);

      if (user?.uid && isFirebaseAvailable()) {
        try {
          await service.deleteBoardTask(user.uid, taskId);
        } catch (e: any) {
          setError(e.message);
        }
      }
    },
    [user?.uid, tasks],
  );

  const moveTask = useCallback(
    async (taskId: string, toColumn: string, newOrder: number) => {
      setTasks((prev) => {
        const updated = prev.map((t) => {
          if (t.id === taskId) return { ...t, column: toColumn, order: newOrder };
          if (t.column === toColumn && t.order >= newOrder && t.id !== taskId) {
            return { ...t, order: t.order + 1 };
          }
          return t;
        });
        saveLocal(updated);
        return updated;
      });

      if (user?.uid && isFirebaseAvailable()) {
        try {
          await service.updateBoardTask(user.uid, taskId, { column: toColumn, order: newOrder });
        } catch (e: any) {
          setError(e.message);
        }
      }
    },
    [user?.uid],
  );

  const moveTasksBulk = useCallback(
    async (fromColumn: string, toColumn: string) => {
      const affected = tasks.filter((t) => t.column === fromColumn);
      if (affected.length === 0) return;

      const existingCount = tasks.filter((t) => t.column === toColumn).length;

      setTasks((prev) => {
        let offset = existingCount;
        return prev.map((t) => {
          if (t.column === fromColumn) {
            return { ...t, column: toColumn, order: offset++ };
          }
          return t;
        });
      });

      if (user?.uid && isFirebaseAvailable()) {
        let offset = existingCount;
        for (const t of affected) {
          try {
            await service.updateBoardTask(user.uid, t.id, { column: toColumn, order: offset++ });
          } catch (e: any) {
            setError(e.message);
          }
        }
      }
    },
    [user?.uid, tasks],
  );

  const getColumnTasks = useCallback(
    (column: string) =>
      tasks.filter((t) => t.column === column).sort((a, b) => a.order - b.order),
    [tasks],
  );

  return { tasks, loading, error, addTask, updateTask, deleteTask, moveTask, moveTasksBulk, getColumnTasks };
}
