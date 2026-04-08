import { useState, useRef, useCallback, type PointerEvent as ReactPointerEvent } from 'react';

const STORAGE_PREFIX = 'dzone_pos_';

export function usePanelDrag(storageKey: string, defaultX: number, defaultY: number) {
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}${storageKey}`);
      return saved ? JSON.parse(saved) : { x: defaultX, y: defaultY };
    } catch {
      return { x: defaultX, y: defaultY };
    }
  });

  const dragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const posRef = useRef(pos);
  posRef.current = pos;

  const onPointerDown = useCallback((e: ReactPointerEvent) => {
    if ((e.target as HTMLElement).closest('button, input, textarea, select, a, [data-no-drag]')) return;

    dragging.current = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startPos.current = { ...posRef.current };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  }, []);

  const onPointerMove = useCallback((e: ReactPointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - startMouse.current.x;
    const dy = e.clientY - startMouse.current.y;
    setPos({
      x: startPos.current.x + dx,
      y: startPos.current.y + dy,
    });
  }, []);

  const onPointerUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    localStorage.setItem(`${STORAGE_PREFIX}${storageKey}`, JSON.stringify(posRef.current));
  }, [storageKey]);

  const externalSetPos = useCallback((newPos: { x: number; y: number }) => {
    setPos(newPos);
    posRef.current = newPos;
  }, []);

  const savePos = useCallback(() => {
    localStorage.setItem(`${STORAGE_PREFIX}${storageKey}`, JSON.stringify(posRef.current));
  }, [storageKey]);

  return {
    pos,
    setPos: externalSetPos,
    savePos,
    dragHandleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
    },
    containerStyle: {
      position: 'fixed' as const,
      left: pos.x,
      top: pos.y,
    },
  };
}
