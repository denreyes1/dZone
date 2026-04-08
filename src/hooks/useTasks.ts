import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { isFirebaseAvailable } from '@/config/firebase';
import * as taskService from '@/services/tasks';
import type { Task } from '@/types';

const LOCAL_KEY = 'dzone_tasks';

function loadLocalTasks(): Task[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLocalTasks(tasks: Task[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(tasks));
}

export function useTasks() {
  const user = useAuthStore((s) => s.user);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid || !isFirebaseAvailable()) {
      setTasks(loadLocalTasks());
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = taskService.subscribeTasks(user.uid, (t) => {
      setTasks(t);
      setLoading(false);
    });
    return unsub;
  }, [user?.uid]);

  const addTask = useCallback(
    async (text: string) => {
      if (user?.uid && isFirebaseAvailable()) {
        await taskService.addTask(user.uid, text);
      } else {
        const newTask: Task = {
          id: crypto.randomUUID(),
          text,
          completed: false,
          createdAt: null,
          completedAt: null,
        };
        const updated = [newTask, ...tasks];
        setTasks(updated);
        saveLocalTasks(updated);
      }
    },
    [user?.uid, tasks],
  );

  const toggleTask = useCallback(
    async (taskId: string, completed: boolean) => {
      if (user?.uid && isFirebaseAvailable()) {
        await taskService.toggleTask(user.uid, taskId, completed);
      } else {
        const updated = tasks.map((t) => (t.id === taskId ? { ...t, completed } : t));
        setTasks(updated);
        saveLocalTasks(updated);
      }
    },
    [user?.uid, tasks],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      if (user?.uid && isFirebaseAvailable()) {
        await taskService.deleteTask(user.uid, taskId);
      } else {
        const updated = tasks.filter((t) => t.id !== taskId);
        setTasks(updated);
        saveLocalTasks(updated);
      }
    },
    [user?.uid, tasks],
  );

  return { tasks, loading, addTask, toggleTask, deleteTask };
}
