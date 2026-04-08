import { useState, useRef, useCallback, type PointerEvent as ReactPointerEvent } from 'react';

const STORAGE_PREFIX = 'dzone_size_';

export type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const CURSORS: Record<ResizeEdge, string> = {
  n: 'ns-resize',
  s: 'ns-resize',
  e: 'ew-resize',
  w: 'ew-resize',
  ne: 'nesw-resize',
  sw: 'nesw-resize',
  nw: 'nwse-resize',
  se: 'nwse-resize',
};

interface ResizeOptions {
  minW?: number;
  minH?: number;
  getPos?: () => { x: number; y: number };
  setPos?: (pos: { x: number; y: number }) => void;
  savePos?: () => void;
}

export function usePanelResize(
  storageKey: string,
  defaultW: number,
  defaultH: number,
  options: ResizeOptions = {},
) {
  const { minW = 300, minH = 200, getPos, setPos: setPosExt, savePos: savePosExt } = options;

  const [size, setSize] = useState<{ w: number; h: number }>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}${storageKey}`);
      return saved ? JSON.parse(saved) : { w: defaultW, h: defaultH };
    } catch {
      return { w: defaultW, h: defaultH };
    }
  });

  const sizeRef = useRef(size);
  sizeRef.current = size;

  const resizing = useRef<{
    edge: ResizeEdge;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
    startPosX: number;
    startPosY: number;
  } | null>(null);

  const startResize = useCallback(
    (edge: ResizeEdge) => (e: ReactPointerEvent) => {
      const pos = getPos?.() ?? { x: 0, y: 0 };
      resizing.current = {
        edge,
        startX: e.clientX,
        startY: e.clientY,
        startW: sizeRef.current.w,
        startH: sizeRef.current.h,
        startPosX: pos.x,
        startPosY: pos.y,
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      e.preventDefault();
      e.stopPropagation();
    },
    [getPos],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (!resizing.current) return;
      const { edge, startX, startY, startW, startH, startPosX, startPosY } = resizing.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let newW = startW;
      let newH = startH;

      if (edge.includes('e')) newW = startW + dx;
      if (edge.includes('w')) newW = startW - dx;
      if (edge.includes('s')) newH = startH + dy;
      if (edge.includes('n')) newH = startH - dy;

      newW = Math.max(minW, newW);
      newH = Math.max(minH, newH);

      setSize({ w: newW, h: newH });

      if (setPosExt && (edge.includes('w') || edge.includes('n'))) {
        const newPosX = edge.includes('w') ? startPosX + (startW - newW) : startPosX;
        const newPosY = edge.includes('n') ? startPosY + (startH - newH) : startPosY;
        setPosExt({ x: newPosX, y: newPosY });
      }
    },
    [minW, minH, setPosExt],
  );

  const onPointerUp = useCallback(() => {
    if (!resizing.current) return;
    resizing.current = null;
    localStorage.setItem(`${STORAGE_PREFIX}${storageKey}`, JSON.stringify(sizeRef.current));
    savePosExt?.();
  }, [storageKey, savePosExt]);

  const handleProps = useCallback(
    (edge: ResizeEdge) => ({
      onPointerDown: startResize(edge),
      onPointerMove,
      onPointerUp,
      style: { cursor: CURSORS[edge] } as React.CSSProperties,
    }),
    [startResize, onPointerMove, onPointerUp],
  );

  return {
    size,
    handleProps,
    sizeStyle: { width: size.w, height: size.h } as React.CSSProperties,
  };
}
