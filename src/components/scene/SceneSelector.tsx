import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { X, Link, Plus } from 'lucide-react';
import { useSceneStore } from '@/stores/sceneStore';
import { useUIStore } from '@/stores/uiStore';
import { useSceneHistory, extractVideoId } from '@/hooks/useSceneHistory';
import { SCENES } from '@/utils/constants';
import { SceneCard } from './SceneCard';
import { GlassPanel } from '@/components/ui/GlassPanel';

export function SceneSelector() {
  const { activeSceneId, setActiveScene } = useSceneStore();
  const toggleSceneSelector = useUIStore((s) => s.toggleSceneSelector);
  const { customScenes, addCustomScene, removeCustomScene, persistLastActive } = useSceneHistory();
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  function selectScene(id: string) {
    setActiveScene(id);
    persistLastActive(id);
    toggleSceneSelector();
  }

  function handleAddUrl(e: FormEvent) {
    e.preventDefault();
    setUrlError('');
    const videoId = extractVideoId(url.trim());
    if (!videoId) {
      setUrlError('Invalid YouTube URL');
      return;
    }
    const scene = addCustomScene(videoId);
    if (scene) {
      setActiveScene(scene.id);
      persistLastActive(scene.id);
      setUrl('');
      toggleSceneSelector();
    }
  }

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

      <form onSubmit={handleAddUrl} className="mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Paste YouTube URL..."
              value={url}
              onChange={(e) => { setUrl(e.target.value); setUrlError(''); }}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-accent-amber/40 focus:outline-none focus:ring-2 focus:ring-accent-amber/40"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-1 rounded-xl bg-accent-amber/20 px-3 text-sm font-medium text-accent-amber transition-colors hover:bg-accent-amber/30"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
        {urlError && <p className="mt-1 text-xs text-red-400">{urlError}</p>}
      </form>

      <motion.div className="grid grid-cols-2 gap-3">
        {SCENES.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            active={scene.id === activeSceneId}
            onClick={() => selectScene(scene.id)}
          />
        ))}
        {customScenes.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            active={scene.id === activeSceneId}
            onClick={() => selectScene(scene.id)}
            onDelete={() => removeCustomScene(scene.id)}
          />
        ))}
      </motion.div>
    </GlassPanel>
  );
}
