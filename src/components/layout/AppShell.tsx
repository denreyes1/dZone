import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SceneViewer } from '@/components/scene/SceneViewer';
import { FloatingDock } from './FloatingDock';
import { SceneSelector } from '@/components/scene/SceneSelector';
import { AudioMixer } from '@/components/audio/AudioMixer';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { TimerSettings } from '@/components/timer/TimerSettings';
import { StatsCard } from '@/components/stats/StatsCard';
import { ProfileDropdown } from '@/components/profile/ProfileDropdown';
import { TimerWidget } from '@/components/timer/TimerWidget';
import { QuoteWidget } from '@/components/widgets/QuoteWidget';
import { YouTubePlayer } from '@/components/youtube/YouTubePlayer';
import { useUIStore } from '@/stores/uiStore';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useTimer } from '@/hooks/useTimer';
import { useAudio } from '@/hooks/useAudio';
import { usePreferences } from '@/hooks/usePreferences';
import { WifiOff } from 'lucide-react';

export function AppShell() {
  const {
    showSceneSelector,
    showAudioMixer,
    showBoard,
    showTimerSettings,
    showStats,
    offlineMode,
    isFocusMode,
  } = useUIStore();

  useKeyboard();
  useTimer();
  useAudio();
  usePreferences();

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <SceneViewer />

      {offlineMode && (
        <div className="fixed left-1/2 top-3 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-amber-900/80 px-4 py-1.5 text-xs text-amber-200 backdrop-blur-sm">
          <WifiOff size={14} />
          Offline mode — changes will sync when reconnected
        </div>
      )}

      {!isFocusMode && (
        <div className="fixed right-4 top-4 z-30 flex items-center gap-3">
          <ProfileDropdown />
        </div>
      )}

      <TimerWidget />

      {!isFocusMode && !showBoard && (
        <QuoteWidget />
      )}

      <AnimatePresence>
        {showSceneSelector && <SceneSelector key="scenes" />}
        {showAudioMixer && <AudioMixer key="audio" />}
        {showBoard && !isFocusMode && <KanbanBoard key="board" />}
        {showTimerSettings && <TimerSettings key="timer-settings" />}
        {showStats && <StatsCard key="stats" />}
      </AnimatePresence>

      <YouTubePlayer />

      {!isFocusMode && <FloatingDock />}

      <Outlet />
    </div>
  );
}
