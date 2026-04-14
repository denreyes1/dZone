import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSceneStore } from '@/stores/sceneStore';
import { useSceneHistory } from '@/hooks/useSceneHistory';

export function SceneViewer() {
  const activeSceneId = useSceneStore((s) => s.activeSceneId);
  const { allScenes } = useSceneHistory();

  const scene = useMemo(
    () => allScenes.find((s) => s.id === activeSceneId) ?? allScenes[0],
    [activeSceneId, allScenes],
  );

  const embedUrl = `https://www.youtube.com/embed/${scene.videoId}?autoplay=1&mute=1&loop=1&playlist=${scene.videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3&playsinline=1`;

  return (
    <div className="fixed inset-0 -z-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0"
            style={{ background: scene.gradient }}
          />

          <div className="absolute inset-0 overflow-hidden">
            <iframe
              src={embedUrl}
              title={scene.name}
              allow="autoplay; encrypted-media"
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: '100vw',
                height: '100vh',
                minWidth: '177.78vh',
                minHeight: '56.25vw',
                border: 'none',
              }}
            />
          </div>

          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-void/20" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
