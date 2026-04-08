import { useState, useMemo } from 'react';
import { X, Volume2 } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAudioStore } from '@/stores/audioStore';
import { AMBIENT_SOUNDS, SOUND_CATEGORIES } from '@/utils/constants';
import { SoundChannel } from './SoundChannel';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import type { SoundCategory } from '@/types';

export function AudioMixer() {
  const toggleAudioMixer = useUIStore((s) => s.toggleAudioMixer);
  const { masterVolume, setMasterVolume, stopAll } = useAudioStore();
  const [activeCategory, setActiveCategory] = useState<SoundCategory>('rain');

  const filteredSounds = useMemo(
    () => AMBIENT_SOUNDS.filter((s) => s.category === activeCategory),
    [activeCategory],
  );

  return (
    <GlassPanel
      variant="strong"
      className="absolute bottom-20 left-4 right-4 flex max-h-[70vh] flex-col p-5 md:left-auto md:right-4 md:w-[360px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">Ambient Sounds</h2>
        <button
          onClick={toggleAudioMixer}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <Volume2 size={18} className="shrink-0 text-gray-400" />
        <Slider value={masterVolume} onChange={setMasterVolume} />
        <span className="shrink-0 text-xs text-gray-500">{masterVolume}%</span>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {SOUND_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
              activeCategory === cat.id
                ? 'bg-accent-amber/20 text-accent-amber'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200',
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {filteredSounds.map((sound) => (
          <SoundChannel key={sound.id} sound={sound} />
        ))}
      </div>

      <Button variant="ghost" onClick={stopAll} className="mt-4 w-full text-gray-400">
        Stop All
      </Button>
    </GlassPanel>
  );
}
