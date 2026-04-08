import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { isFirebaseAvailable } from '@/config/firebase';
import * as service from '@/services/boardColumns';
import { DEFAULT_COLUMNS, type ColumnConfig } from '@/types/kanban';

const LOCAL_KEY = 'dzone_board_columns';

function loadLocal(): ColumnConfig[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_COLUMNS;
  } catch {
    return DEFAULT_COLUMNS;
  }
}

function saveLocal(columns: ColumnConfig[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(columns));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function useBoardColumns() {
  const user = useAuthStore((s) => s.user);
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid || !isFirebaseAvailable()) {
      setColumns(loadLocal());
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = service.subscribeBoardColumns(user.uid, (cols) => {
      setColumns(cols);
      saveLocal(cols);
      setLoading(false);
    });
    return unsub;
  }, [user?.uid]);

  const persist = useCallback(
    (next: ColumnConfig[]) => {
      setColumns(next);
      saveLocal(next);
      if (user?.uid && isFirebaseAvailable()) {
        service.saveBoardColumns(user.uid, next);
      }
    },
    [user?.uid],
  );

  const addColumn = useCallback(
    (label: string, color: string) => {
      const id = slugify(label) || `col-${Date.now()}`;
      const unique = columns.some((c) => c.id === id)
        ? `${id}-${Date.now()}`
        : id;
      persist([...columns, { id: unique, label, color }]);
    },
    [columns, persist],
  );

  const removeColumn = useCallback(
    (id: string) => {
      if (columns.length <= 1) return null;
      const next = columns.filter((c) => c.id !== id);
      persist(next);
      return next[0].id;
    },
    [columns, persist],
  );

  const renameColumn = useCallback(
    (id: string, label: string) => {
      persist(columns.map((c) => (c.id === id ? { ...c, label } : c)));
    },
    [columns, persist],
  );

  const updateColumnColor = useCallback(
    (id: string, color: string) => {
      persist(columns.map((c) => (c.id === id ? { ...c, color } : c)));
    },
    [columns, persist],
  );

  const reorderColumns = useCallback(
    (reordered: ColumnConfig[]) => {
      persist(reordered);
    },
    [persist],
  );

  return {
    columns,
    columnIds: columns.map((c) => c.id),
    loading,
    addColumn,
    removeColumn,
    renameColumn,
    updateColumnColor,
    reorderColumns,
  };
}
