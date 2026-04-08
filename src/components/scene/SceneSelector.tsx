import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useSceneStore } from '@/stores/sceneStore';
import { useUIStore } from '@/stores/uiStore';
import { SCENES } from '@/utils/constants';
import { SceneCard } from './SceneCard';
import { GlassPanel } from '@/components/ui/GlassPanel';

export function SceneSelector() {
  const { activeSceneId, setActiveScene } = useSceneStore();
  const toggleSceneSelector = useUIStore((s) => s.toggleSceneSelector);

  return (
    <GlassPanel
      variant="strong"
      className="absolute bottom-20 left-4 right-4 max-h-[70vh] overflow-y-auto p-5 md:left-auto md:right-4 md:w-[420px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">Choose a Scene</h2>
        <button
          onClick={toggleSceneSelector}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>
      <motion.div className="grid grid-cols-2 gap-3">
        {SCENES.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            active={scene.id === activeSceneId}
            onClick={() => {
              setActiveScene(scene.id);
              toggleSceneSelector();
            }}
          />
        ))}
      </motion.div>
    </GlassPanel>
  );
}
