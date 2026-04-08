import { create } from 'zustand';

export interface YouTubeHistoryItem {
  videoId: string;
  title: string;
  url: string;
  playedAt: number;
}

interface YouTubeState {
  currentVideoId: string | null;
  currentUrl: string | null;
  isPlaying: boolean;
  history: YouTubeHistoryItem[];

  playVideo: (url: string) => void;
  stopVideo: () => void;
  setPlaying: (v: boolean) => void;
  playFromHistory: (item: YouTubeHistoryItem) => void;
  removeFromHistory: (videoId: string) => void;
  clearHistory: () => void;
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function loadHistory(): YouTubeHistoryItem[] {
  try {
    const raw = localStorage.getItem('dzone-yt-history');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: YouTubeHistoryItem[]) {
  localStorage.setItem('dzone-yt-history', JSON.stringify(history));
}

async function fetchVideoTitle(videoId: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`,
    );
    const data = await res.json();
    return data.title || null;
  } catch {
    return null;
  }
}

export const useYouTubeStore = create<YouTubeState>((set, get) => ({
  currentVideoId: null,
  currentUrl: null,
  isPlaying: false,
  history: loadHistory(),

  playVideo: (url) => {
    const videoId = extractVideoId(url.trim());
    if (!videoId) return;

    const existing = get().history.find((h) => h.videoId === videoId);
    const title = existing?.title && existing.title !== existing.videoId
      ? existing.title
      : videoId;

    const item: YouTubeHistoryItem = {
      videoId,
      title,
      url: url.trim(),
      playedAt: Date.now(),
    };

    const history = [item, ...get().history.filter((h) => h.videoId !== videoId)].slice(0, 50);
    saveHistory(history);
    set({ currentVideoId: videoId, currentUrl: url.trim(), isPlaying: true, history });

    if (title === videoId) {
      fetchVideoTitle(videoId).then((fetched) => {
        if (!fetched) return;
        const updated = get().history.map((h) =>
          h.videoId === videoId ? { ...h, title: fetched } : h,
        );
        saveHistory(updated);
        set({ history: updated });
      });
    }
  },

  stopVideo: () => {
    set({ currentVideoId: null, currentUrl: null, isPlaying: false });
  },

  setPlaying: (v) => set({ isPlaying: v }),

  playFromHistory: (item) => {
    const history = [
      { ...item, playedAt: Date.now() },
      ...get().history.filter((h) => h.videoId !== item.videoId),
    ].slice(0, 50);
    saveHistory(history);
    set({ currentVideoId: item.videoId, currentUrl: item.url, isPlaying: true, history });
  },

  removeFromHistory: (videoId) => {
    const history = get().history.filter((h) => h.videoId !== videoId);
    saveHistory(history);
    set({ history });
  },

  clearHistory: () => {
    saveHistory([]);
    set({ history: [] });
  },
}));
