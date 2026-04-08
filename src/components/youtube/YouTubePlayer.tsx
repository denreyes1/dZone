import { useState, useRef, useCallback, type PointerEvent as ReactPointerEvent } from 'react';
import { X, Play, Trash2, Square, Youtube, GripVertical } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useYouTubeStore } from '@/stores/youtubeStore';
import { usePanelDrag } from '@/hooks/usePanelDrag';
import { cn } from '@/utils/cn';

const MIN_W = 280;
const MIN_H = 180;
const MAX_W = 900;
const MAX_H = 800;
const SIZE_KEY = 'dzone_size_youtube';

function loadSize() {
  try {
    const raw = localStorage.getItem(SIZE_KEY);
    return raw ? JSON.parse(raw) : { w: 360, h: 420 };
  } catch {
    return { w: 360, h: 420 };
  }
}

export function YouTubePlayer() {
  const showPanel = useUIStore((s) => s.showYoutubePlayer);
  const togglePanel = useUIStore((s) => s.toggleYoutubePlayer);
  const {
    currentVideoId,
    history,
    playVideo,
    stopVideo,
    playFromHistory,
    removeFromHistory,
    clearHistory,
  } = useYouTubeStore();

  const [url, setUrl] = useState('');
  const drag = usePanelDrag('youtube', 16, window.innerHeight - 500);

  const [size, setSize] = useState(loadSize);
  const sizeRef = useRef(size);
  sizeRef.current = size;
  const resizing = useRef(false);
  const resizeStart = useRef({ x: 0, y: 0 });
  const resizeStartSize = useRef({ w: 360, h: 420 });

  const onResizeDown = useCallback((e: ReactPointerEvent) => {
    resizing.current = true;
    resizeStart.current = { x: e.clientX, y: e.clientY };
    resizeStartSize.current = { ...sizeRef.current };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onResizeMove = useCallback((e: ReactPointerEvent) => {
    if (!resizing.current) return;
    const dx = e.clientX - resizeStart.current.x;
    const dy = e.clientY - resizeStart.current.y;
    setSize({
      w: Math.max(MIN_W, Math.min(MAX_W, resizeStartSize.current.w + dx)),
      h: Math.max(MIN_H, Math.min(MAX_H, resizeStartSize.current.h + dy)),
    });
  }, []);

  const onResizeUp = useCallback(() => {
    if (!resizing.current) return;
    resizing.current = false;
    localStorage.setItem(SIZE_KEY, JSON.stringify(sizeRef.current));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      playVideo(url);
      setUrl('');
    }
  };

  if (!showPanel && !currentVideoId) return null;

  const containerStyle: React.CSSProperties = showPanel
    ? { ...drag.containerStyle, width: size.w, zIndex: 50 }
    : { position: 'fixed', left: -9999, top: 0, zIndex: 50 };

  return (
    <div style={containerStyle}>
      <div
        className="glass-strong relative flex flex-col overflow-hidden rounded-2xl"
        style={{ height: showPanel ? size.h : undefined }}
      >
        {/* Drag handle header */}
        <div
          {...drag.dragHandleProps}
          className="flex shrink-0 cursor-grab items-center justify-between px-4 pb-2 pt-3 active:cursor-grabbing"
        >
          <div className="flex items-center gap-2">
            <GripVertical size={14} className="text-gray-600" />
            <Youtube size={18} className="text-red-500" />
            <h2 className="text-sm font-semibold text-gray-100">YouTube</h2>
          </div>
          <div className="flex items-center gap-1">
            {currentVideoId && (
              <button
                onClick={stopVideo}
                title="Stop"
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Square size={14} />
              </button>
            )}
            <button
              onClick={togglePanel}
              title="Close"
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* URL Input */}
        <form onSubmit={handleSubmit} className="flex shrink-0 gap-2 px-4 pb-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL..."
            className={cn(
              'flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-100',
              'placeholder:text-gray-500',
              'transition-colors focus:border-accent-amber/40 focus:outline-none focus:ring-2 focus:ring-accent-amber/40',
            )}
          />
          <button
            type="submit"
            disabled={!url.trim()}
            className={cn(
              'flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl transition-all',
              url.trim()
                ? 'bg-accent-amber text-void hover:bg-amber-400'
                : 'bg-white/5 text-gray-600',
            )}
          >
            <Play size={16} />
          </button>
        </form>

        {/* Video Embed */}
        {currentVideoId && (
          <div className="shrink-0 px-4 pb-3">
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black/40">
              <iframe
                src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&rel=0`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="flex min-h-0 flex-1 flex-col border-t border-white/5 px-4 py-3">
            <div className="mb-2 flex shrink-0 items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                History
              </span>
              <button
                onClick={clearHistory}
                className="text-xs text-gray-600 transition-colors hover:text-gray-400"
              >
                Clear
              </button>
            </div>
            <div className="scrollbar-thin min-h-0 flex-1 space-y-0.5 overflow-y-auto">
              {history.map((item) => (
                <div
                  key={item.videoId}
                  className="group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5"
                >
                  <button
                    onClick={() => playFromHistory(item)}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    <Play
                      size={12}
                      className={cn(
                        'shrink-0 transition-colors',
                        item.videoId === currentVideoId
                          ? 'text-accent-amber'
                          : 'text-gray-600 group-hover:text-accent-amber',
                      )}
                    />
                    <span
                      className={cn(
                        'truncate text-xs transition-colors',
                        item.videoId === currentVideoId
                          ? 'text-accent-amber'
                          : 'text-gray-400 group-hover:text-gray-200',
                      )}
                    >
                      {item.title}
                    </span>
                  </button>
                  <button
                    onClick={() => removeFromHistory(item.videoId)}
                    className="shrink-0 rounded p-0.5 text-gray-600 opacity-0 transition-all hover:text-red-400 group-hover:opacity-100"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resize handle */}
        <div
          onPointerDown={onResizeDown}
          onPointerMove={onResizeMove}
          onPointerUp={onResizeUp}
          className="absolute bottom-0 right-0 z-10 flex h-5 w-5 cursor-se-resize items-end justify-end p-0.5"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" className="text-gray-600">
            <path d="M9 1v8H1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M9 5v4H5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
