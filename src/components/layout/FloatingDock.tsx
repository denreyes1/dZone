import {
  Image,
  Timer,
  CloudRain,
  Youtube,
  Kanban,
  Maximize,
  Minimize,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useUIStore } from '@/stores/uiStore';
import { useFullscreen } from '@/hooks/useFullscreen';
import { cn } from '@/utils/cn';

export function FloatingDock() {
  const {
    showSceneSelector,
    showAudioMixer,
    showTimer,
    showYoutubePlayer,
    showBoard,
    isFullscreen,
    toggleSceneSelector,
    toggleAudioMixer,
    toggleTimer,
    toggleYoutubePlayer,
    toggleBoard,
  } = useUIStore();
  const { toggle: toggleFullscreen } = useFullscreen();

  const items = [
    { icon: Image, label: 'Scenes', active: showSceneSelector, onClick: toggleSceneSelector, shortcut: 'S' },
    { icon: Timer, label: 'Timer', active: showTimer, onClick: toggleTimer, shortcut: '⎵' },
    { icon: CloudRain, label: 'Sounds', active: showAudioMixer, onClick: toggleAudioMixer, shortcut: 'M' },
    { icon: Youtube, label: 'YouTube', active: showYoutubePlayer, onClick: toggleYoutubePlayer, shortcut: 'Y' },
    { icon: Kanban, label: 'Board', active: showBoard, onClick: toggleBoard, shortcut: 'T' },
    {
      icon: isFullscreen ? Minimize : Maximize,
      label: isFullscreen ? 'Exit Fullscreen' : 'Fullscreen',
      active: isFullscreen,
      onClick: toggleFullscreen,
      shortcut: 'F',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-strong fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 px-2 py-2"
    >
      {items.map(({ icon: Icon, label, active, onClick, shortcut }) => (
        <button
          key={label}
          onClick={onClick}
          title={`${label} (${shortcut})`}
          className={cn(
            'group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all md:h-12 md:w-12',
            active
              ? 'bg-accent-amber/20 text-accent-amber'
              : 'text-gray-400 hover:bg-white/10 hover:text-white',
          )}
        >
          <Icon size={20} />
          <span className="pointer-events-none absolute -top-8 rounded-lg bg-panel px-2 py-1 text-xs text-gray-300 opacity-0 transition-opacity group-hover:opacity-100">
            {label}
          </span>
        </button>
      ))}
    </motion.div>
  );
}
