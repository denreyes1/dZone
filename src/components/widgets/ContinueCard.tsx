import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useSessions } from '@/hooks/useSessions';
import { useSceneStore } from '@/stores/sceneStore';
import { useTimerStore } from '@/stores/timerStore';
import { SCENES } from '@/utils/constants';
import { formatDuration } from '@/utils/formatTime';
import { Button } from '@/components/ui/Button';

export function ContinueCard() {
  const { recentSessions } = useSessions();
  const setActiveScene = useSceneStore((s) => s.setActiveScene);
  const start = useTimerStore((s) => s.start);

  const lastSession = recentSessions[0];
  if (!lastSession) return null;

  const scene = SCENES.find((s) => s.id === lastSession.sceneId);
  if (!scene) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${scene.videoId}/hqdefault.jpg`;

  function handleContinue() {
    setActiveScene(lastSession.sceneId);
    start();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass flex items-center gap-4 p-4"
    >
      <div
        className="h-12 w-12 shrink-0 rounded-xl bg-cover bg-center"
        style={{ backgroundImage: `url(${thumbnailUrl})` }}
      />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-200">Continue in {scene.name}</p>
        <p className="text-xs text-gray-500">
          Last session: {formatDuration(lastSession.duration)}
        </p>
      </div>
      <Button size="icon" onClick={handleContinue}>
        <Play size={16} />
      </Button>
    </motion.div>
  );
}
